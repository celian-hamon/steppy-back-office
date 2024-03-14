import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import {ChakraProvider} from '@chakra-ui/react';
import theme from 'theme/theme';
import {ThemeEditorProvider} from '@hypertheme-editor/chakra-ui';
import redirect from "react-router-dom/es/Redirect";

const isLogged = localStorage.getItem('token') !== null;
console.log(isLogged);

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <React.StrictMode>
            <ThemeEditorProvider>
                <HashRouter>
                    <Switch>
                        <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
                        {isLogged&&<Route path='/admin' render={(props) => <AdminLayout {...props} />} />}
                        <Redirect from='/' to={isLogged ? '/admin/default' : '/auth/sign-in'} />
                    </Switch>
                </HashRouter>
            </ThemeEditorProvider>
        </React.StrictMode>
    </ChakraProvider>,
    document.getElementById('root')
)
;
