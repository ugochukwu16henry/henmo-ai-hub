import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterprisePage from '../page';

describe('EnterprisePage', () => {
  // Test 1: Ensure the main page title renders correctly.
  it('renders the main heading', () => {
    render(<EnterprisePage />);
    const heading = screen.getByRole('heading', {
      name: /enterprise features/i,
    });
    expect(heading).toBeInTheDocument();
  });

  // Test 2: Verify that all the main feature tabs are present.
  it('renders all the feature tabs', () => {
    render(<EnterprisePage />);
    expect(screen.getByRole('tab', { name: /sso & auth/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /audit logs/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /compliance/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /white label/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /sla monitoring/i })).toBeInTheDocument();
  });

  // Test 3: Check if the SSO tab content is visible by default.
  it('shows the SSO & Auth content by default', () => {
    render(<EnterprisePage />);
    const ssoHeading = screen.getByRole('heading', {
      name: /single sign-on \(sso\)/i,
    });
    expect(ssoHeading).toBeInTheDocument();
  });

  // Test 4: Simulate a click on the "Audit Logs" tab and verify the content changes.
  it('switches to the Audit Logs tab and displays its content', () => {
    render(<EnterprisePage />);
    const auditTab = screen.getByRole('tab', { name: /audit logs/i });

    fireEvent.click(auditTab);

    const auditLogHeading = screen.getByRole('heading', {
      name: /audit logs/i,
    });
    expect(auditLogHeading).toBeInTheDocument();
    expect(screen.getByText('user.login@company.com')).toBeInTheDocument();
  });

  // Test 5: Test the interactivity of the SSO enable/disable button.
  it('toggles the SSO status when the button is clicked', () => {
    render(<EnterprisePage />);
    const ssoButton = screen.getByRole('button', { name: /enable sso/i });
    expect(screen.getByText('Disabled')).toBeInTheDocument();

    fireEvent.click(ssoButton);

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /configure sso/i })).toBeInTheDocument();
  });
});