import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH = 'isRefresh';
export const isRefresh = () => SetMetadata(IS_REFRESH, true);
