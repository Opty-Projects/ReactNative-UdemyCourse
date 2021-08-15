import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export default function useDimensions() {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      });
    };
    Dimensions.addEventListener('change', updateDimensions);
    return () => {
      Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  return dimensions;
}
