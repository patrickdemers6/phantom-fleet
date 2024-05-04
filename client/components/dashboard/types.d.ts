type FieldOption = {
  name: string;
  shortName: string;
  value: string | number;
  items?: TileItem[];
};

type ItemData = unknown;

type TileItem = {
  type: string;
  data: ItemData;
  field?: string;
  fieldType: string;
  defaultValue: any;
  title?: string;
};

type TileConfig = {
  title: string;
  items: TileItem[];
};
type TileProps = {
  config: TileConfig;
  vin: Vin;
};

type RenderSubItems = (props: { secondary: boolean; vin: Vin; items: TileItem[]; }) => JSX.Element;
