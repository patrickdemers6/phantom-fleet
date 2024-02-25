import CircleSelect from './CircleSelect';
import Dropdown from './Dropdown';
import Slider from './Slider';
import TextInput from './TextInput';
import VehicleTextInput from './VehicleTextInput';

export const itemRenderers = {
  dropdown: Dropdown,
  circleselect: CircleSelect,
  'vehicle-text-input': VehicleTextInput,
  slider: Slider,
  'text-input': TextInput,
};

const GenericRenderer = (props: RendererProps<any> & { type: string }) => {
  const Render = itemRenderers[props.type as keyof typeof itemRenderers];
  return <Render {...props} />;
};

export default GenericRenderer;
