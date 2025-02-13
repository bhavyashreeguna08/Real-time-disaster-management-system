using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Linq;

namespace DisasterManagement.IncidentService.Dtos
{
    public class IncidentDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Region { get; set; }

        // Optional Image Upload
        // Custom validation for image size and type
        [FileExtensionValidation(Extensions = new[] { ".jpg", ".jpeg", ".png" })]
        [MaxFileSize(5 * 1024 * 1024)] // Max file size = 5 MB
        public IFormFile Image { get; set; }
    }

    // Custom validation attribute for file extension
    public class FileExtensionValidation : ValidationAttribute
    {
        public string[] Extensions { get; set; }

        public FileExtensionValidation()
        {
        }

        public override bool IsValid(object value)
        {
            // Check if value is an IFormFile
            var file = value as IFormFile;

            // If no file is provided, it is valid (this assumes image is optional)
            if (file == null)
            {
                return true; // No image file, so it's valid
            }

            // Get the file extension
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            // Return true if the file extension is one of the allowed types
            return Extensions.Contains(fileExtension);
        }

        // Override the ErrorMessage when validation fails
        public override string FormatErrorMessage(string name)
        {
            return $"Invalid file type. Only the following extensions are allowed: {string.Join(", ", Extensions)}.";
        }
    }

    // Custom validation attribute for file size
    public class MaxFileSize : ValidationAttribute
    {
        public long MaxSize { get; set; }

        public MaxFileSize(long maxSize)
        {
            MaxSize = maxSize;
        }

        public override bool IsValid(object value)
        {
            // Check if value is an IFormFile
            var file = value as IFormFile;

            // If no file is provided, it's valid (this assumes image is optional)
            if (file == null)
            {
                return true; // No file uploaded, so it's valid
            }

            // Return true if the file size is less than or equal to MaxSize
            return file.Length <= MaxSize;
        }

        // Override the ErrorMessage when validation fails
        public override string FormatErrorMessage(string name)
        {
            return $"File size must be less than {MaxSize / (1024 * 1024)} MB.";
        }
    }
}
