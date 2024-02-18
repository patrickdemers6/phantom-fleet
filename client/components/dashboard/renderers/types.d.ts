type RendererProps<T> = {
  vin: Vin,
  handleChangeFns: ((data: unknown) => void)[];
  values: unknown[];
  data: T;
  RenderSubItems: RenderSubItems;
};
