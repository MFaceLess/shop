import type { ReplaceProperty } from '../../../utils';
import type { IColor, IColorWithSizes } from './color.interface';

export interface IProduct {
  id: number;
  name: string;
  colors: IColor[];
}

export type IProductWithSizes = ReplaceProperty<IProduct, 'colors', IColorWithSizes[]>;
