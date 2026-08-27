import { beforeEach, describe, expect, test, vi } from 'vitest';
import getHttpServerCommand from '../server.js';
import { getCommandRunner } from './testingUtils.js';

const mockListen = vi.hoisted(() => vi.fn());

vi.mock(import('http-server'), () => {
  class HttpServer {
    listen = mockListen;
  }

  return {
    default: HttpServer,
    createServer: () => new HttpServer()
  } as any;
});

const runCommand = getCommandRunner(getHttpServerCommand);

describe('Test server command', () => {
  beforeEach(() => {
    mockListen.mockClear();
  });

  test('with default values', async () => {
    await expect(runCommand()).commandSuccess();
    expect(mockListen).toHaveBeenCalledExactlyOnceWith(8022, '127.0.0.1');
  });

  test('with valid port', async () => {
    await expect(runCommand('--port', '999')).commandSuccess();
    expect(mockListen).toHaveBeenCalledExactlyOnceWith(999, '127.0.0.1');
  });

  test('with invalid port number', async () => {
    await expect(runCommand('--port', '100000')).commandExit();
    expect(mockListen).not.toHaveBeenCalled();
  });

  test('with invalid port value', async () => {
    await expect(runCommand('--port', '-1')).commandExit();
    expect(mockListen).not.toHaveBeenCalled();
  });

  test('with invalid port words', async () => {
    await expect(runCommand('--port', 'abcd')).commandExit();
    expect(mockListen).not.toHaveBeenCalled();
  });

  test('with port specified by env variable', async () => {
    vi.stubEnv('PORT', '6000');
    try {
      await expect(runCommand()).commandSuccess();
      expect(mockListen).toHaveBeenCalledExactlyOnceWith(6000, '127.0.0.1');
    } finally {
      vi.unstubAllEnvs();
    }
  });

  test('with specified IP address', async () => {
    await expect(runCommand('--bind', '172.16.0.1')).commandSuccess();
    expect(mockListen).toHaveBeenCalledExactlyOnceWith(8022, '172.16.0.1');
  });

  test('with invalid IP address', async () => {
    await expect(runCommand('--bind', '300.16.0.1')).commandSuccess();
    // Let IP address validation be handled on the NodeJS side
    expect(mockListen).toHaveBeenCalledExactlyOnceWith(8022, '300.16.0.1');
  });
});
