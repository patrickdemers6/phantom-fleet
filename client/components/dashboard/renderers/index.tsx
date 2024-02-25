import CircleSelect from './CircleSelect';
import Dropdown from './Dropdown';
import Mock from './Mock';
import Slider from './Slider';
import TextInput from './TextInput';
import Vehicle from './Vehicle';

export const itemRenderers = {
  dropdown: Dropdown,
  circleselect: CircleSelect,
  vehicle: Vehicle,
  slider: Slider,
  mock: Mock,
  'text-input': TextInput,
};

export type GenericRendererProps = RendererProps<any> & { type: string };

const GenericRenderer = (props: GenericRendererProps) => {
  const Render = itemRenderers[props.type as keyof typeof itemRenderers];
  return <Render {...props} />;
};

export default GenericRenderer;
