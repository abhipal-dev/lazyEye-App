import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

// Local bundled assets for offline & zero-latency loading of authentic avatars
const LOCAL_AVATARS = {
  'user_22_test1.jpg': require('../assets/avatars/user_22_test1.jpg'),
  'user_4_Screenshot from 2023-01-25 10-21-56.png': require('../assets/avatars/user_4_Screenshot from 2023-01-25 10-21-56.png'),
  'user_6_0_default_female_profile_image.png': require('../assets/avatars/user_6_0_default_female_profile_image.png'),
  'user_11_0_default_male_profile_image.png': require('../assets/avatars/user_11_0_default_male_profile_image.png'),
  'user_18_0_default_male_profile_image.png': require('../assets/avatars/user_18_0_default_male_profile_image.png'),
  '0_default_female_profile_image.png': require('../assets/avatars/0_default_female_profile_image.png'),
  '0_default_male_profile_image.png': require('../assets/avatars/0_default_male_profile_image.png'),
  'default.png': require('../assets/avatars/default.png'),
};

const REMOTE_STORAGE_BASE = 'https://lazyeye.onrender.com/storage/images';

/**
 * Resolves the appropriate ImageSource for a user
 * @param {Object} user 
 * @returns {ImageSourcePropType}
 */
export const getAvatarSource = (user) => {
  if (!user) {
    return LOCAL_AVATARS['0_default_male_profile_image.png'];
  }

  const filename = user.image_address;

  // 1. Check exact match in bundled local avatars
  if (filename && LOCAL_AVATARS[filename]) {
    return LOCAL_AVATARS[filename];
  }

  // 2. Strip potential path prefixes (e.g. "images/foo.png" or "user_profile_images/bar.png")
  if (filename) {
    const base = filename.split('/').pop().split('\\').pop();
    if (LOCAL_AVATARS[base]) {
      return LOCAL_AVATARS[base];
    }
  }

  // 3. If filename exists but not in bundled assets, resolve from live server
  if (filename && (filename.startsWith('http://') || filename.startsWith('https://'))) {
    return { uri: filename };
  }

  if (filename && typeof filename === 'string' && filename.trim().length > 0 && filename !== 'default.png') {
    return { uri: `${REMOTE_STORAGE_BASE}/${filename.trim()}` };
  }

  // 4. Fallback based on user gender
  const isFemale = user.gender && user.gender.toLowerCase() === 'female';
  return isFemale
    ? LOCAL_AVATARS['0_default_female_profile_image.png']
    : LOCAL_AVATARS['0_default_male_profile_image.png'];
};

/**
 * Reusable Avatar Component that renders crisp, authentic profile images
 */
export const AvatarImage = ({
  user,
  size = 40,
  style,
  borderColor,
  borderWidth = 1.5,
}) => {
  const source = getAvatarSource(user);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: borderColor || 'rgba(0,0,0,0.1)',
          borderWidth: borderColor ? borderWidth : 0,
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default {
  getAvatarSource,
  AvatarImage,
};

