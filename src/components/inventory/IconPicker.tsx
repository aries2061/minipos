'use client';

import { useState } from 'react';
import { Box, Text, Input, SimpleGrid } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import {
  FiShoppingBag, FiCoffee, FiBox, FiPackage, FiTool, FiHeart,
  FiStar, FiZap, FiDroplet, FiSun, FiMoon, FiCloud,
  FiHome, FiPhone, FiMonitor, FiTablet, FiCamera, FiHeadphones,
  FiWatch, FiGift, FiBook, FiFeather, FiScissors, FiUmbrella,
  FiTruck, FiShoppingCart, FiDollarSign, FiCreditCard, FiTag,
  FiFolder, FiArchive, FiGrid, FiLayers, FiCircle, FiSquare,
  FiTriangle, FiHexagon, FiAward, FiFlag, FiGlobe,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

export const iconMap: Record<string, IconType> = {
  FiShoppingBag, FiCoffee, FiBox, FiPackage, FiTool, FiHeart,
  FiStar, FiZap, FiDroplet, FiSun, FiMoon, FiCloud,
  FiHome, FiPhone, FiMonitor, FiTablet, FiCamera, FiHeadphones,
  FiWatch, FiGift, FiBook, FiFeather, FiScissors, FiUmbrella,
  FiTruck, FiShoppingCart, FiDollarSign, FiCreditCard, FiTag,
  FiFolder, FiArchive, FiGrid, FiLayers, FiCircle, FiSquare,
  FiTriangle, FiHexagon, FiAward, FiFlag, FiGlobe,
};

export const iconNames = Object.keys(iconMap);

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const filtered = search
    ? iconNames.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    : iconNames;

  return (
    <Box>
      <Text fontSize="sm" mb={1}>{t('inventory.categoryIcon' as TranslationKey)}</Text>
      <Input
        size="sm"
        placeholder={t('inventory.searchIcon' as TranslationKey)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={2}
      />
      <Box maxH="200px" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="md" p={2}>
        <SimpleGrid columns={8} gap={1}>
          {filtered.map((name) => {
            const IconComponent = iconMap[name];
            const isSelected = value === name;
            return (
              <Box
                key={name}
                p={2}
                borderRadius="md"
                cursor="pointer"
                bg={isSelected ? 'blue.500' : 'transparent'}
                color={isSelected ? 'white' : 'gray.700'}
                _hover={{ bg: isSelected ? 'blue.600' : 'gray.100' }}
                onClick={() => onChange(name)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                title={name.replace('Fi', '')}
              >
                <Icon as={IconComponent} boxSize={5} />
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
