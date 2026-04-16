import React from 'react';
import useBuilderStore from '../useBuilderStore';

/**
 * EditableText: Wrapper inteligente para textos interactivos en el editor.
 * Si isPreview es true, permite la edición inline.
 */
const EditableText = ({ 
  field, 
  value, 
  as: Tag = 'p', 
  className = '', 
  isPreview = false, 
  itemIdx = null, 
  itemField = null 
}) => {
  const { updateSectionContent, updateListItem } = useBuilderStore();

  if (!isPreview) {
    return <Tag className={className}>{value}</Tag>;
  }

  const handleChange = (e) => {
    const newVal = e.target.innerText;
    if (itemIdx !== null && itemField !== null) {
      updateListItem(itemIdx, itemField, newVal);
    } else {
      updateSectionContent(field, newVal);
    }
  };

  return (
    <Tag 
      contentEditable 
      suppressContentEditableWarning
      onBlur={handleChange}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
      className={`${className} outline-none focus:ring-2 focus:ring-indigo-600 rounded-sm hover:bg-indigo-600/5 transition-all`}
    >
      {value}
    </Tag>
  );
};

export default EditableText;