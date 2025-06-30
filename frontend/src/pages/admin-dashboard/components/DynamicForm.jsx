import React, { useState, useEffect, useRef } from 'react';

const DynamicForm = ({ fields = [], initialData, onSubmit, onCancel, isLoading, error: propError }) => {
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [multipleFiles, setMultipleFiles] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [formError, setFormError] = useState('');
  // Keep track of accumulated files for multiple file inputs
  const filesAccumulator = useRef({});

  // Ensure fields is always an array
  const safeFieldsConfig = Array.isArray(fields) ? fields : [];

  // Initial form setup
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations

    try {
      // Handle form data initialization when editing an existing item
      const defaultData = {};
      const initialPreviews = {};
      const initialMultipleFiles = {};

      console.log('Initial data received by DynamicForm:', initialData);

      // For videos, set uploadType based on whether videoLink exists
      if (initialData?.fileType === 'video') {
        console.log('Video file detected:', {
          fileType: initialData.fileType,
          filePath: initialData.filePath,
          videoLink: initialData.videoLink,
          mediaUrl: initialData.mediaUrl,
          thumbnailPath: initialData.thumbnailPath,
          thumbnailUrl: initialData.thumbnailUrl
        });

        // Set initial uploadType value
        if (initialData?.videoLink) {
          defaultData.uploadType = 'Video Link';
        } else {
          defaultData.uploadType = 'Upload File';
        }
      }

      // Process each field to set up initial state
      safeFieldsConfig.forEach(field => {
        // Skip if field name is undefined
        if (!field.name) return;

        try {
          // Handle numeric fields explicitly
          if (field.type === 'number' && initialData && initialData[field.name] !== undefined) {
            defaultData[field.name] = Number(initialData[field.name]);
          }
          else if (field.type === 'file') {
            defaultData[field.name] = null; // Initialize file fields to null

            if (initialData) {
              // Store existing URL for later reference
              if (field.existingImageUrl) {
                initialPreviews[field.name] = field.existingImageUrl;
              }
              // For media files, check filePath, mediaUrl, and other fields
              else if (field.name === 'mediafile') {
                initialPreviews[field.name] = initialData.mediaUrl || initialData.filePath || '';
              }
              // For thumbnail files
              else if (field.name === 'thumbnail') {
                initialPreviews[field.name] = initialData.thumbnailUrl || initialData.thumbnailPath || '';
              }
              // For other image fields
              else {
                initialPreviews[field.name] = initialData[`${field.name}Url`] ||
                  initialData[field.name] ||
                  initialData.filePath || '';

                // Clean up empty string URLs
                if (!initialPreviews[field.name]) {
                  delete initialPreviews[field.name];
                }
              }
            }
          }
          else if (field.type === 'file-multiple') {
            // Initialize multiple file fields
            defaultData[field.name] = [];
            filesAccumulator.current[field.name] = []; // Initialize accumulator for this field

            // If we have gallery data from the backend
            if (field.name === 'gallery' && initialData?.gallery) {
              console.log('Gallery data found in initialData:', initialData.gallery);

              // Handle different gallery data structures
              let galleryImages = [];

              if (Array.isArray(initialData.gallery)) {
                galleryImages = initialData.gallery;
              } else if (typeof initialData.gallery === 'string') {
                // Handle comma-separated string of URLs
                try {
                  if (initialData.gallery.includes(',')) {
                    galleryImages = initialData.gallery.split(',').map(url => url.trim());
                  } else {
                    galleryImages = [initialData.gallery];
                  }
                } catch (err) {
                  console.error('Error parsing gallery string:', err);
                  galleryImages = [];
                }
              } else if (initialData.gallery && typeof initialData.gallery === 'object') {
                // Try to handle object format
                galleryImages = [initialData.gallery];
              }

              // Enhanced processing of gallery images
              initialMultipleFiles[field.name] = galleryImages.map(img => {
                if (typeof img === 'string') return img;
                if (img && typeof img === 'object') {
                  // If object has filePath, use that directly (Cloudinary URL)
                  if (img.filePath) return img.filePath;
                  // If object has url property, use that
                  if (img.url) return img.url;
                  // If object has publicId but no url or filePath, keep as is
                  if (img.publicId) return img.publicId;
                  // Try other common properties
                  if (img.path) return img.path;
                }
                return null;
              }).filter(Boolean); // Remove any null/undefined entries

              console.log('Processed gallery images for display:', initialMultipleFiles[field.name]);
            } else {
              // Initialize with empty array to ensure we don't get [object Object] issues
              initialMultipleFiles[field.name] = [];
              console.log(`Initialized empty gallery for new ${field.name}`);
            }
          }
          else if (field.type === 'date' && initialData?.[field.name]) {
            // Format date for input field (YYYY-MM-DD)
            const date = new Date(initialData[field.name]);
            if (!isNaN(date.getTime())) {
              // Ensure proper ISO format for date input (YYYY-MM-DD)
              // Need to adjust for timezone to avoid off-by-one day errors
              const year = date.getUTCFullYear();
              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
              const day = String(date.getUTCDate()).padStart(2, '0');
              defaultData[field.name] = `${year}-${month}-${day}`;
              console.log(`Date field ${field.name} formatted to:`, defaultData[field.name]);
            } else {
              defaultData[field.name] = '';
              console.log(`Invalid date for ${field.name}:`, initialData[field.name]);
            }
          }
          else if (field.name === 'gallery' && initialData?.gallery && field.type !== 'file-multiple') {
            // Convert gallery array to comma-separated string for editing (for textarea type galleries)
            if (Array.isArray(initialData.gallery)) {
              defaultData[field.name] = initialData.gallery
                .map(img => typeof img === 'string' ? img : (img?.url || ''))
                .filter(Boolean)
                .join(', ');
            } else if (typeof initialData.gallery === 'string') {
              defaultData[field.name] = initialData.gallery;
            } else {
              defaultData[field.name] = '';
            }
          }
          // Handle galleryUrls for Media items
          else if (field.name === 'galleryUrls' && initialData?.gallery) {
            // Convert gallery array to comma-separated string for galleryUrls field
            if (Array.isArray(initialData.gallery)) {
              defaultData[field.name] = initialData.gallery
                .map(img => typeof img === 'string' ? img : (img?.url || ''))
                .filter(Boolean)
                .join(', ');
            } else if (typeof initialData.gallery === 'string') {
              defaultData[field.name] = initialData.gallery;
            } else {
              defaultData[field.name] = '';
            }
          }
          else if (field.name === 'type' && initialData?.fileType) {
            // Map fileType back to type for select fields
            if (initialData.fileType === 'document') {
              defaultData[field.name] = 'News Article';
            }
            else if (initialData.fileType === 'video') {
              // Default to first video type option
              const videoOption = field.options?.find(opt =>
                opt === 'Documentary' || opt === 'Video Series' || opt === 'Video'
              );
              defaultData[field.name] = videoOption || 'Documentary';
            }
            else {
              defaultData[field.name] = initialData[field.name] || '';
            }
          }
          // Handle program name/title field mapping
          else if ((field.name === 'name' || field.name === 'title') && initialData) {
            // If we have a name field but title in the data (or vice versa)
            defaultData[field.name] = initialData[field.name] || initialData['title'] || initialData['name'] || '';
          }
          // Standard field handling - copy from initialData if available
          else if (initialData && initialData[field.name] !== undefined) {
            defaultData[field.name] = initialData[field.name];
          }

          // Special handling for select fields to ensure they have defaults
          if (field.type === 'select' && field.required && !defaultData[field.name] && field.options?.length > 0) {
            defaultData[field.name] = field.options[0];
          }

          // Specific default for uploadType
          if (field.name === 'uploadType' && !defaultData[field.name]) {
            defaultData[field.name] = 'Upload File';
          }
        } catch (err) {
          console.error(`Error processing field ${field.name}:`, err);
        }
      });

      // Special case handling - if type is set to a video type, ensure uploadType is set
      if (defaultData.type && (defaultData.type === 'Documentary' || defaultData.type === 'Video Series') && !defaultData.uploadType) {
        defaultData.uploadType = 'Upload File';
      }

      console.log('Initial form data:', defaultData);

      // Set form data with initial values
      setFormData(defaultData);
      setPreviews(initialPreviews);
      setMultipleFiles(initialMultipleFiles);
      setIsInitialized(true);
    } catch (err) {
      console.error('Error initializing form:', err);
      setFormError('Error initializing form. Please try again.');
    }
  }, [safeFieldsConfig, initialData]);

  // Reset form when initialData changes (like when editing a different item)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      console.log('Initial data changed, resetting form');
      setIsInitialized(false); // Force reinitialization
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (!name) return; // Skip if field name is undefined

    console.log(`Field ${name} changed:`, type === 'file' ? 'File selected' : value);

    // Handle special dependencies between fields
    if (name === 'type') {
      // When type changes to video type, set a default uploadType
      if (value === 'Documentary' || value === 'Video Series') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          uploadType: prev.uploadType || 'Upload File' // Set default if not already set
        }));
        console.log('Updated form data after type change:', { ...formData, [name]: value, uploadType: formData.uploadType || 'Upload File' });
        return; // Early return since we've already set formData
      }
    } else if (name === 'uploadType') {
      // Handle switch between Video Link and Upload File
      console.log(`Upload type changed to: ${value}`);

      // Force an immediate state update for uploadType to ensure it's captured
      const updatedFormData = {
        ...formData,
        [name]: value,
        // Clear videoLink if switching to Upload File
        ...(value === 'Upload File' ? { videoLink: '' } : {})
      };

      setFormData(updatedFormData);
      console.log('Updated form data after uploadType change:', updatedFormData);
      return; // Early return since we've already set formData
    }

    // Handle different input types
    if (type === 'file') {
      // Check if this is a multiple file field
      if (e.target.multiple) {
        // Multiple file handling code...
        const selectedFiles = Array.from(files);
        console.log(`Multiple files selected for ${name}:`, selectedFiles.map(f => f.name));

        setFormData(prev => ({
          ...prev,
          [name]: selectedFiles
        }));

        const previewsObj = {};
        selectedFiles.forEach(file => {
          previewsObj[file.name] = URL.createObjectURL(file);
        });

        setPreviews(prev => ({
          ...prev,
          ...previewsObj
        }));
      } else {
        // Handle single file
        if (files && files.length > 0) {
          const file = files[0];
          console.log(`Single file selected for ${name}:`, file.name);

          // Check file size for mediafile (10MB limit)
          if (name === 'mediafile') {
            const fileSize = file.size / (1024 * 1024); // Convert to MB
            if (fileSize > 10) {
              setFormError('File size should be less than 10MB');
              // Clear the file input
              e.target.value = '';
              return;
            } else {
              setFormError('');
            }
          }

          // Update form data with the file
          setFormData(prev => ({ ...prev, [name]: file }));

          // Create and set a preview URL
          const previewUrl = URL.createObjectURL(file);
          setPreviews(prev => ({
            ...prev,
            [name]: previewUrl
          }));
        } else {
          // No file selected (e.g., user canceled file dialog)
          console.log(`No file selected for ${name}, preserving current state`);
        }
      }
    } else if (type === 'checkbox') {
      // Handle checkbox values
      setFormData(prev => ({ ...prev, [name]: checked }));
      console.log(`Checkbox ${name} changed to:`, checked);
    } else {
      // For all other inputs including select, text, etc.
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add functionality to remove individual files from multiple selections
  const handleRemoveFile = (fieldName, index) => {
    // Remove the file from the accumulator
    if (filesAccumulator.current[fieldName]) {
      const updatedFiles = [...filesAccumulator.current[fieldName]];
      updatedFiles.splice(index, 1);
      filesAccumulator.current[fieldName] = updatedFiles;

      // Update form data with the array directly
      setFormData(prev => ({
        ...prev,
        [fieldName]: updatedFiles.length > 0 ? updatedFiles : []
      }));
    }

    // Remove the preview and track the removed image for Cloudinary deletion
    setMultipleFiles(prev => {
      const updatedPreviews = [...(prev[fieldName] || [])];
      const removedImage = updatedPreviews[index];

      // If this is a Cloudinary URL (not a local blob URL), mark it for deletion
      if (removedImage && typeof removedImage === 'string' && !removedImage.startsWith('blob:')) {
        console.log('Marking image for deletion:', removedImage);
        // Store the public ID or URL of the image to be deleted
        const publicId = removedImage.split('/').pop().split('.')[0];

        // Add a hidden field to track images to delete if it doesn't exist
        if (!formData.imagesToDelete) {
          setFormData(prev => ({
            ...prev,
            imagesToDelete: [{ url: removedImage, publicId }]
          }));
        } else {
          // Add to existing array of images to delete
          setFormData(prev => ({
            ...prev,
            imagesToDelete: [...(prev.imagesToDelete || []), { url: removedImage, publicId }]
          }));
        }
      }

      updatedPreviews.splice(index, 1);
      return { ...prev, [fieldName]: updatedPreviews };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Clear any previous error
    setFormError('');

    // Log the form data that will be submitted
    console.log('Form data before submission:', formData);
    console.log('Current uploadType value:', formData.uploadType);

    // Create a copy of the form data for processing
    const processedFormData = { ...formData };

    // Special handling for upload type to ensure it's explicitly set
    if (processedFormData.type === 'Documentary' || processedFormData.type === 'Video Series') {
      // If uploadType is missing, set a default
      if (!processedFormData.uploadType) {
        processedFormData.uploadType = processedFormData.videoLink ? 'Video Link' : 'Upload File';
        console.log('Set default uploadType in submission:', processedFormData.uploadType);
      }

      // If uploadType is Upload File, ensure videoLink is cleared
      if (processedFormData.uploadType === 'Upload File') {
        processedFormData.videoLink = '';
        console.log('Cleared videoLink for Upload File submission');
      }
    }

    // Validate required fields
    let missingFields = [];

    safeFieldsConfig.forEach(field => {
      // Skip field if it's conditionally shown and condition is not met
      if (field.showIf && field.showIfValue) {
        const dependentFieldValue = processedFormData[field.showIf];

        // If showIfValue is an array, check if the dependentFieldValue is included
        if (Array.isArray(field.showIfValue)) {
          if (!field.showIfValue.includes(dependentFieldValue)) {
            return; // Skip this field if condition not met
          }
        } else {
          // Otherwise just check for equality
          if (dependentFieldValue !== field.showIfValue) {
            return; // Skip this field if condition not met
          }
        }
      }

      if (field.required && !processedFormData[field.name]) {
        missingFields.push(field.label || field.name);
      }
    });

    if (missingFields.length > 0) {
      setFormError(`Required fields missing: ${missingFields.join(', ')}`);
      return;
    }

    // Special validation for video link
    if (processedFormData.uploadType === 'Video Link' && !processedFormData.videoLink &&
      (processedFormData.type === 'Documentary' || processedFormData.type === 'Video Series')) {
      setFormError('Video Link is required when Upload Type is set to Video Link');
      return;
    }

    // Create FormData instance for file uploads and form submission
    const formDataToSubmit = new FormData();

    // Add all form data to the FormData object
    for (const key in processedFormData) {
      if (processedFormData[key] !== undefined && processedFormData[key] !== null) {
        if (key === 'gallery') {
          if (Array.isArray(processedFormData.gallery)) {
            processedFormData.gallery.forEach((file) => {
              if (file instanceof File) {
                formDataToSubmit.append('gallery', file); // key must match the input name
              }
            });
          }
        } else if (key === 'mediafile' || key === 'thumbnail') {
          if (processedFormData[key] instanceof File) {
            formDataToSubmit.append(key, processedFormData[key]);
          }
        }
        else {
          // Handle all other inputs
          formDataToSubmit.append(key, processedFormData[key]);
        }
      }
    }

    // Log what we're submitting (for debugging)
    console.log('FormData being submitted:');
    for (const [key, value] of formDataToSubmit.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    // Call the onSubmit function with the FormData
    onSubmit(formDataToSubmit, { multipleFiles }, processedFormData);
  };

  const renderField = (field) => {
    if (!field || !field.name) {
      console.error('Invalid field configuration:', field);
      return null;
    }

    // For debugging
    if (field.name === 'uploadType' || field.name === 'videoLink' || field.name === 'mediafile') {
      console.log(`Rendering field ${field.name} with current form data:`, {
        uploadType: formData.uploadType,
        videoLink: formData.videoLink,
        mediafile: formData.mediafile ? 'File selected' : 'No file',
        type: formData.type
      });
    }

    // Common props for all fields
    const commonProps = {
      id: field.name,
      name: field.name,
      onChange: handleChange,
      required: field.required,
      disabled: isLoading,
      className: 'mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50'
    };

    // Check if this field should be conditionally shown based on another field
    if (field.showIf && field.showIfValue) {
      const dependentFieldValue = formData[field.showIf];

      // If showIfValue is an array, check if the dependentFieldValue is included
      if (Array.isArray(field.showIfValue)) {
        if (!field.showIfValue.includes(dependentFieldValue)) {
          return null; // Don't render if condition not met
        }
      } else {
        // Otherwise just check for equality
        if (dependentFieldValue !== field.showIfValue) {
          return null; // Don't render if condition not met
        }
      }
    }

    // Special case for uploadType - always render it if type is Documentary or Video Series
    if (field.name === 'uploadType' &&
      (formData.type === 'Documentary' || formData.type === 'Video Series')) {
      // This is a special case, we will always render the upload type dropdown
      // if the media type is a video type
      console.log('Forcing display of uploadType field with value:', formData.uploadType);
    }

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} value={formData[field.name] || ''} rows={4} placeholder={field.placeholder || ''}></textarea>;

      // Custom select specifically for handling uploadType to ensure the value is properly captured
      case 'custom-select':
        console.log(`Rendering custom select for "${field.name}" with value:`, formData[field.name]);

        // Directly handle the change event for this specific field
        const handleCustomSelectChange = (e) => {
          const newValue = e.target.value;
          console.log(`Custom select ${field.name} changed to:`, newValue);

          // Directly update the form data with the new value
          const updatedData = {
            ...formData,
            [field.name]: newValue
          };

          // If changing to Upload File, clear videoLink
          if (field.name === 'uploadType' && newValue === 'Upload File') {
            updatedData.videoLink = '';
          }

          setFormData(updatedData);
          console.log('Updated form data after custom select change:', updatedData);
        };

        return (
          <div className="relative">
            <select
              {...commonProps}
              value={formData[field.name] || ''}
              onChange={handleCustomSelectChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 bg-white text-gray-700"
            >
              <option value="">Select upload type</option>
              {(field.options || []).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'select':
        // Debug current value
        console.log(`Rendering select field "${field.name}" with value:`, formData[field.name]);
        console.log(`Options for ${field.name}:`, field.options);

        // For video media types, ensure uploadType is explicitly set 
        if (field.name === 'uploadType' && !formData[field.name] &&
          (formData.type === 'Documentary' || formData.type === 'Video Series')) {
          // Set a default value
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              uploadType: 'Upload File'
            }));
          }, 0);
        }

        return (
          <select
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => {
              console.log(`Select ${field.name} changed to:`, e.target.value);
              handleChange(e);
            }}
          >
            <option value="">Select...</option>
            {(field.options || []).map(option => (
              typeof option === 'object'
                ? <option key={option.value} value={option.value}>{option.label}</option>
                : <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              checked={formData[field.name] === true}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">{field.description || ''}</span>
          </div>
        );
      case 'file-multiple':
        return (
          <div>
            <input
              {...commonProps}
              type="file"
              accept="image/*"
              multiple
            />

            {/* Show selected gallery images */}
            {multipleFiles[field.name] && multipleFiles[field.name].length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Selected images ({multipleFiles[field.name].length}):</span>
                  {field.maxCount && ` (max ${field.maxCount})`}
                </p>
                <div className="flex flex-wrap gap-3 p-2 border border-gray-200 rounded bg-gray-50">
                  {multipleFiles[field.name].map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="border-2 border-green-500 rounded overflow-hidden">
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="h-20 w-20 object-cover"
                          onError={(e) => {
                            console.log(`Failed to load image at URL: ${url}`);
                            e.target.src = "/assets/images/no_image.png";
                          }}
                        />
                      </div>
                      {index === 0 && (
                        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
                          Cover
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(field.name, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 relative">
                    <label htmlFor={`${field.name}-additional`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                      <span className="text-3xl">+</span>
                    </label>
                    <input
                      id={`${field.name}-additional`}
                      name={field.name}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {!multipleFiles[field.name] || multipleFiles[field.name].length === 0 ? (
              <p className="mt-2 text-xs text-gray-500 italic">
                {field.maxCount ? `You can upload up to ${field.maxCount} images` : 'Upload multiple images'}.
                The first image will be used as the cover if no cover image is provided.
              </p>
            ) : null}
          </div>
        );
      case 'file':
        // Determine accept type based on field name
        const acceptType = field.name === 'mediafile' ? "*/*" : (field.accept || "image/*");
        const previewUrl = previews[field.name];

        // Show hint if provided
        const hint = field.hint ? (
          <p className="mt-2 text-xs text-gray-500 italic">{field.hint}</p>
        ) : null;

        return (
          <div>
            <input
              {...commonProps}
              type="file"
              accept={acceptType}
            />
            {hint}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Current file {!field.required && "(will be kept if no new file is selected)"}:
                </p>
                {(field.name === 'mediafile' && (initialData?.fileType === 'video' || (previewUrl && previewUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/)))) ? (
                  <div className="relative">
                    <video
                      src={previewUrl}
                      className="max-w-full h-auto object-contain rounded"
                      style={{ maxHeight: '200px' }}
                      controls
                      preload="metadata"
                      poster={initialData?.thumbnailUrl || initialData?.thumbnailPath}
                    />
                    <div className="text-xs mt-1 text-gray-500">Video Preview</div>
                  </div>
                ) : (
                  <img src={previewUrl} alt="Preview" className="h-32 w-auto object-cover rounded" />
                )}
              </div>
            )}
            {!field.required && !previewUrl && !hint && (
              <p className="mt-2 text-xs text-gray-500 italic">This field is optional</p>
            )}
          </div>
        );
      case 'text':
        // Special handling for videoUrl field
        if (field.name === 'videoUrl') {
          const videoUrl = formData[field.name];
          const isVideoType = formData.fileType === 'video';

          // Make the field required if fileType is 'video'
          const updatedProps = {
            ...commonProps,
            required: isVideoType
          };

          return (
            <div>
              <input
                {...updatedProps}
                type="text"
                value={formData[field.name] || ''}
                placeholder={field.placeholder || ''}
              />
              {isVideoType && !videoUrl && (
                <p className="mt-1 text-xs text-red-500">
                  Video URL is required when File Type is Video
                </p>
              )}
              {videoUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Video Preview:</p>
                  {videoUrl.includes('youtube.com') ? (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0]}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                  ) : videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()}`}
                      width="100%"
                      height="180"
                      frameBorder="0"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      className="rounded"
                    ></iframe>
                  ) : videoUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i) ? (
                    <video
                      src={videoUrl}
                      width="100%"
                      height="180"
                      controls
                      preload="metadata"
                      className="rounded"
                    />
                  ) : (
                    <div className="p-4 bg-gray-100 text-gray-600 rounded text-center">
                      External video: {videoUrl}
                    </div>
                  )}
                </div>
              )}
              {field.hint && (
                <p className="mt-1 text-xs text-gray-500 italic">{field.hint}</p>
              )}
            </div>
          );
        }
        // Default text field
        return <input {...commonProps} type="text" value={formData[field.name] || ''} placeholder={field.placeholder || ''} />;
      case 'number':
      case 'date':
      default:
        return <input {...commonProps} type={field.type || 'text'} value={formData[field.name] || ''} placeholder={field.placeholder || ''} />;
    }
  };

  // Show a message if there are no form fields to render
  if (safeFieldsConfig.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No form fields available to display.</p>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(propError || formError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {propError || formError}
        </div>
      )}

      {safeFieldsConfig.map(field => {
        // The actual rendering of fields is handled by renderField
        return field && field.name ? (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label || field.name}</label>
            {renderField(field)}
          </div>
        ) : null;
      })}

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center justify-center min-w-[120px] ${isLoading ? 'opacity-80 cursor-wait' : ''
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;