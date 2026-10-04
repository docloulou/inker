import { describe, it, expect, beforeEach } from 'bun:test';
import type { Response } from 'express';
import { PluginsController } from './plugins.controller';
import type { PluginsService } from './plugins.service';
import type { OAuthService } from './oauth/oauth.service';
import { createMock, type MockFn } from '../test/mocks/helpers';

describe('PluginsController — GET instances/:id/render', () => {
  let controller: PluginsController;
  let renderInstance: MockFn;
  let res: Response;

  beforeEach(() => {
    renderInstance = createMock().mockResolvedValue(Buffer.from('PNG'));
    controller = new PluginsController(
      { renderInstance } as unknown as PluginsService,
      {} as unknown as OAuthService,
    );
    // Minimal express Response stub: the handler only calls set() and send().
    res = { set: createMock(), send: createMock() } as unknown as Response;
  });

  it('threads palette=spectra6 to the plugin renderer', async () => {
    await controller.renderInstance(3, 'full', 'device', 'spectra6', res);
    expect(renderInstance.calls[0]).toEqual([3, 'full', 'device', 'spectra6']);
  });

  it('ignores unknown palette values', async () => {
    await controller.renderInstance(3, 'full', 'device', 'acep7', res);
    expect(renderInstance.calls[0]).toEqual([3, 'full', 'device', undefined]);
  });

  it('renders without a palette when none is given', async () => {
    await controller.renderInstance(3, 'full', 'device', undefined as unknown as string, res);
    expect(renderInstance.calls[0]).toEqual([3, 'full', 'device', undefined]);
  });
});
