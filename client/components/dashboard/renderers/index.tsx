import ButtonGroup from './ButtonGroup';
import CircleSelect from './CircleSelect';
import DateTime from './DateTime';
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
  'button-group': ButtonGroup,
  'date-time': DateTime,
};

export type GenericRendererProps = RendererProps<any> & { type: string };

const GenericRenderer = (props: GenericRendererProps) => {
  const Render = itemRenderers[props.type as keyof typeof itemRenderers];
  return <Render {...props} GenericRenderer={GenericRenderer} />;
};

export default GenericRenderer;
