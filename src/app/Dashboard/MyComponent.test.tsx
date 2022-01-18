import { shallow } from 'enzyme';
import MyComponent from './MyComponent';
import * as React from 'react';

describe('<MyComponent />', () => {
  it('renders button', () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('button').text()).toEqual('Try me');
  });
  it("doesn't have any elements displayed by default", () => {
    const wrapper = shallow(<MyComponent />);
    expect(wrapper.find('ul').children()).toHaveLength(0);
  });
  it('does something', () => {
    const wrapper = shallow(<MyComponent />);
    wrapper.find('button').invoke('onClick');
    console.log(wrapper.debug());
    jest.fn();
  });
});
