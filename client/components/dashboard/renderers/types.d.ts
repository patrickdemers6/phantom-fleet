type RendererProps<T> = {
  vin: Vin,
  handleChange: (data: unknown) => void;
  value: unknown;
  data: T;
  RenderSubItems: RenderSubItems;
};
