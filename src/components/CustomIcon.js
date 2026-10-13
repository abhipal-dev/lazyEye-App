import React from 'react';
import { View, StyleSheet } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LIBRARIES = {
  ionicons: Ionicons,
  materialcommunityicons: MaterialCommunityIcons,
  materialcommunity: MaterialCommunityIcons,
  mci: MaterialCommunityIcons,
  fontawesome5: FontAwesome5,
  fa5: FontAwesome5,
  feather: Feather,
  materialicons: MaterialIcons,
  material: MaterialIcons,
  antdesign: AntDesign,
  fontawesome: FontAwesome,
  fa: FontAwesome,
};

/**
 * CustomIcon: Universal vector icon wrapper for LazyEye
 *
 * @param {string} [library='Ionicons'] - Icon set ("Ionicons", "MaterialCommunityIcons", "FontAwesome5", "Feather", etc.)
 * @param {string} name - Icon name
 * @param {string} [color='#0F172A'] - Icon color
 * @param {number} [size=22] - Icon size in px
 * @param {boolean} [solid=false] - For libraries supporting solid variant (e.g. FontAwesome5)
 * @param {object} [style] - Optional container/icon style
 */
export default function CustomIcon({
  library = 'Ionicons',
  name,
  color = '#0F172A',
  size = 22,
  solid = false,
  style,
  ...rest
}) {
  const normalizedLib = (library || 'ionicons').toLowerCase().trim();
  const IconComponent = LIBRARIES[normalizedLib] || Ionicons;

  if (!name) {
    return <View style={[{ width: size, height: size }, style]} />;
  }

  try {
    if (IconComponent === FontAwesome5) {
      return (
        <FontAwesome5
          name={name}
          color={color}
          size={size}
          solid={solid}
          style={style}
          {...rest}
        />
      );
    }

    return (
      <IconComponent
        name={name}
        color={color}
        size={size}
        style={style}
        {...rest}
      />
    );
  } catch (err) {
    // Graceful fallback if icon name or library encounters an error
    return (
      <Feather
        name="help-circle"
        color={color || '#94A3B8'}
        size={size}
        style={style}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({});

