import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { render } from 'lib/testHelpers';
import React from 'react';
import InfoModal from 'components/Topics/Topic/Messages/Filters/InfoModal';

describe('InfoModal component', () => {
  const renderComponent = () => {
    const toggleIsOpen = jest.fn();
    render(<InfoModal toggleIsOpen={toggleIsOpen} />);
    return { toggleIsOpen };
  };

  it('renders the corrected context variables', () => {
    renderComponent();
    // headers (not the previously-documented "header") and offset must be listed
    expect(screen.getByText('record.headers')).toBeInTheDocument();
    expect(screen.getByText('record.offset')).toBeInTheDocument();
    expect(screen.getByText('record.timestampMs')).toBeInTheDocument();
  });

  it('renders a link to the CEL language definition', () => {
    renderComponent();
    const links = screen.getAllByRole('link', { name: /CEL/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/cel-expr/cel-spec/blob/master/doc/langdef.md'
      );
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('renders a filter example', () => {
    renderComponent();
    expect(screen.getByText('record.partition == 1')).toBeInTheDocument();
  });

  it('closes InfoModal', async () => {
    const { toggleIsOpen } = renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Ok' }));
    expect(toggleIsOpen).toHaveBeenCalledTimes(1);
  });
});
