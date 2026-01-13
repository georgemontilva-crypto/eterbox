import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

export interface RequestInfo {
  ipAddress: string;
  device: string;
  location: string;
}

/**
 * Extract IP address from request
 */
export function getIpAddress(req: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    return ips[0].trim();
  }
  
  const realIp = req.headers['x-real-ip'];
  if (realIp && typeof realIp === 'string') {
    return realIp;
  }
  
  return req.ip || req.socket.remoteAddress || 'Unknown';
}

/**
 * Parse user agent to get device information
 */
export function getDeviceInfo(req: Request): string {
  const userAgent = req.headers['user-agent'];
  if (!userAgent) return 'Unknown Device';
  
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  const browser = result.browser.name || 'Unknown Browser';
  const browserVersion = result.browser.version || '';
  const os = result.os.name || 'Unknown OS';
  const osVersion = result.os.version || '';
  const device = result.device.type || 'Desktop';
  
  // Format: "Chrome 120 on Windows 10 (Desktop)"
  let deviceStr = `${browser}`;
  if (browserVersion) deviceStr += ` ${browserVersion.split('.')[0]}`;
  deviceStr += ` on ${os}`;
  if (osVersion) deviceStr += ` ${osVersion}`;
  if (device !== 'Desktop') deviceStr += ` (${device})`;
  
  return deviceStr;
}

/**
 * Get location from IP address using GeoIP
 */
export function getLocation(ipAddress: string): string {
  // Skip for localhost/private IPs
  if (
    ipAddress === 'Unknown' ||
    ipAddress === '::1' ||
    ipAddress === '127.0.0.1' ||
    ipAddress.startsWith('192.168.') ||
    ipAddress.startsWith('10.') ||
    ipAddress.startsWith('172.')
  ) {
    return 'Local Network';
  }
  
  const geo = geoip.lookup(ipAddress);
  if (!geo) return 'Unknown Location';
  
  const city = geo.city || '';
  const region = geo.region || '';
  const country = geo.country || '';
  
  // Format: "San Francisco, CA, United States"
  const parts = [city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
}

/**
 * Get all request information at once
 */
export function getRequestInfo(req: Request): RequestInfo {
  const ipAddress = getIpAddress(req);
  const device = getDeviceInfo(req);
  const location = getLocation(ipAddress);
  
  return {
    ipAddress,
    device,
    location,
  };
}
