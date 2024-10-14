import { Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';

import { PageLayout } from './components/PageLayout';
import { SharePointLists } from "./pages/SharePointLists";

import './styles/App.css';
import Flows from './pages/Flows';
import Apps from './pages/Apps';
import Client from './pages/Client';
import Migration from './pages/Migration';

const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={<SharePointLists />} />
            <Route path="/flows" element={<Flows />} />
            <Route path="/apps/:selectedEnvironment" element={<Apps />} />
            <Route path="/client" element={<Client />} />
            <Route path="/migration" element={<Migration />} />
        </Routes>
    );
};

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <Pages />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;