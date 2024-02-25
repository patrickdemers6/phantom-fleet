type RendererProps<T> = {
  vin: Vin,
  handleChangeFns: ((data: unknown) => void)[];
  values: unknown[];
  data: T;
  title?: string;
  RenderSubItems?: RenderSubItems;
  GenericRenderer?: (props: GenericRendererProps) => JSX.Element;
};
