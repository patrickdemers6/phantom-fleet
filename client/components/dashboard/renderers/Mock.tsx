type MockData = {
  render: JSX.Element;
};

const Mock = (props: RendererProps<MockData>) => props.data.render;

export default Mock;
