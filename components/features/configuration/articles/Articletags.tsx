import React, { useCallback, useState } from 'react'
import { TiTimes } from 'react-icons/ti';

// Separate TagInput component to avoid hooks in render
const ArticleTagInput: React.FC<{
  field: any;
  errors: any;
  handleInputChange: () => void;
}> = React.memo(({ field, errors, handleInputChange }) => {
  const [currentTag, setCurrentTag] = useState<string>("");
  const tags: string[] = field.value || [];

  const addTag = useCallback(() => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      field.onChange(newTags);
      setCurrentTag("");
      handleInputChange();
    }
  }, [currentTag, tags, field, handleInputChange]);

  const removeTag = useCallback(
    (tagToRemove: string) => {
      const newTags = tags.filter((tag: string) => tag !== tagToRemove);
      field.onChange(newTags);
      handleInputChange();
    },
    [tags, field, handleInputChange]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  return (
    <div>
      <div className="form-group mb-3 d-flex align-items-center">
        <input
          type="text"
          id="article-tags"
          className={`form-control ${errors.tags ? "is-invalid" : ""}`}
          placeholder="Type a tag and press Enter or click Add"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyUp={(e) => handleKeyPress(e)}
        />
        <button
          type="button"
          className="rounded btn btn-primary ms-2 flex-fill text-nowrap"
          onClick={addTag}
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="tags-container mb-2">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="badge bg-primary-light text-primary me-2 mb-1"
              style={{ fontSize: "0.8em", padding: "0.4em 0.6em" }}
            >
              {tag}

              <TiTimes
                className="ms-2 text-danger"
                style={{ fontSize: "1em", cursor: "pointer" }}
                onClick={() => removeTag(tag)}
              />
            </span>
          ))}
        </div>
      )}

      {errors.tags && (
        <div className="invalid-feedback d-block">{errors.tags.message}</div>
      )}
    </div>
  );
});

export default ArticleTagInput;