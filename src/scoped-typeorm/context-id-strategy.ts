import {
  ContextId,
  ContextIdFactory,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';

export class ScopedContextIdStrategy implements ContextIdStrategy {
  private staticContextId = ContextIdFactory.create();

  attach(contextId: ContextId) {
    return (info: HostComponentInfo) => {
      return info.isTreeDurable ? this.staticContextId : contextId;
    };
  }
}
