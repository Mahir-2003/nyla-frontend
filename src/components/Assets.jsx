// LearnIcon.js
import React from 'react';
import { View } from 'react-native';

// Import SVG files directly as components
import EmotionalIcon from '../../assets/learn-icons/emotional.svg';
import IntellectualIcon from '../../assets/learn-icons/intellectual.svg';
import SocialIcon from '../../assets/learn-icons/social.svg';
import PhysicalIcon from '../../assets/learn-icons/physical.svg';
import SpiritualIcon from '../../assets/learn-icons/spiritual.svg';
import ParentingIcon from '../../assets/learn-icons/parenting.svg';

const icons = {
  emotional: EmotionalIcon,
  intellectual: IntellectualIcon,
  social: SocialIcon,
  physical: PhysicalIcon,
  spiritual: SpiritualIcon,
  parenting: ParentingIcon,
};

const LearnIcon = ({ source }) => {
  const iconName = source.toLowerCase(); // Ensure the string is in the correct case
  const IconComponent = icons[iconName];

  if (!IconComponent) {
    console.error(`Icon named ${iconName} does not exist.`);
    return <View />; // Return an empty View or some default icon component
  }

  // Return the SVG component with desired props
  return <IconComponent width="100%" height="100%" />;
};

export default LearnIcon;
