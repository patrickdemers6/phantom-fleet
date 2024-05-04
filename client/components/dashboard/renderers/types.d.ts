type RendererProps<T> = {
  vin: Vin,
  onChange?: ((data: unknown) => void);
  value?: unknown;
  data: T;
  title?: string;
  RenderSubItems?: RenderSubItems;
  GenericRenderer?: (props: GenericRendererProps) => JSX.Element;
  Item: (props: ItemProps) => JSX.Element | null;
};
