import { TranslationOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface LanguageProps {
  className?: string;
}

const lang: { name: string; short: string }[] = [
  { name: '中文', short: 'zh' },
  { name: 'English', short: 'en' },
];

export function Language({ className = '' }: LanguageProps) {
  const [current, setCurrent] = useState('zh');
  const { t, i18n } = useTranslation();

  return (
    <Dropdown
      overlay={
        <Menu>
          {lang.map((item) => (
            <Menu.Item
              onClick={() => {
                if (current !== item.name) {
                  setCurrent(item.short);
                  i18n.changeLanguage(item.short);
                }
              }}
              key={item.short}
            >
              {t(item.name)}
            </Menu.Item>
          ))}
        </Menu>
      }
      className={className}
    >
      <TranslationOutlined />
    </Dropdown>
  );
}
