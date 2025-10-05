// src/components/SvgSkills/index.js

import svg3d from './svg3d';
import svgmotion from './svgmotion';
import svgstrategy from './svgstrategy';

// Map the clean skill string (used in your SKILL_LIST) to the component
const SkillSvgMap = {
  '3D': svg3d,
  'Motion': svgmotion,
  'Strategy': svgstrategy,


};

export default SkillSvgMap;