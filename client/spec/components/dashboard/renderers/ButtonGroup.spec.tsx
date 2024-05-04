import ButtonGroup, { ButtonGroupData } from '@/components/dashboard/renderers/ButtonGroup';
import { testVin } from '@/spec/constants';
import { render, screen } from '@testing-library/react';

describe('ButtonGroup', () => {
  let handleChangeStub: jest.Mock;
  let defaultProps: RendererProps<ButtonGroupData>;
  beforeEach(() => {
    handleChangeStub = jest.fn();
    defaultProps = {
      vin: testVin,
      value: '1',
      data: {
        items: [
          { title: 'one', value: '1' },
          { title: 'two', value: '2' },
        ],
      },
      title: 'Title',
      onChange: handleChangeStub,
    };
  });

  it('renders', () => {
    render(
      <ButtonGroup
        {...defaultProps}
      />,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
  });

  it('highlights selected item', () => {
    render(
      <ButtonGroup {...defaultProps} />,
    );
    expect(screen.getByText('one').classList).toContain('MuiButton-contained');
    expect(screen.getByText('two').classList).not.toContain(
      'MuiButton-contained',
    );
  });
});
