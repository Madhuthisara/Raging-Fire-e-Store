'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider, theme } from 'antd';
import { useEffect, useState } from 'react';

function AntdConfig({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) {
        return (
            <div style={{ visibility: 'hidden' }}>
                {children}
            </div>
        );
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>
    );
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <AntdRegistry>
                <AntdConfig>{children}</AntdConfig>
            </AntdRegistry>
        </NextThemesProvider>
    );
}