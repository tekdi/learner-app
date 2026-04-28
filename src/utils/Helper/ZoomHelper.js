/**
 * Zoom Meeting Helper Functions
 * Parse Zoom meeting links and extract meeting details
 */

/**
 * Parse Zoom meeting link to extract meeting number and password
 * @param {string} zoomLink - Full Zoom meeting link
 * @returns {object} - { meetingNumber, password, isValid }
 * 
 * Example links supported:
 * - https://zoom.us/j/93903519283?pwd=eutjyEQnFzdDaIzcD6PX2Y04MWpbpO.1
 * - https://us05web.zoom.us/j/12345678901?pwd=abc123
 * - zoom.us/j/12345678901?pwd=abc123
 */
export const parseZoomLink = (zoomLink) => {
  try {
    if (!zoomLink) {
      return { isValid: false, error: 'No meeting link provided' };
    }

    // Remove whitespace
    const link = zoomLink.trim();

    // Extract meeting number (after /j/)
    const meetingNumberMatch = link.match(/\/j\/(\d+)/);
    if (!meetingNumberMatch) {
      return { isValid: false, error: 'Invalid meeting link format' };
    }
    const meetingNumber = meetingNumberMatch[1];

    // Extract password (pwd parameter)
    const passwordMatch = link.match(/pwd=([^&\s]+)/);
    const password = passwordMatch ? passwordMatch[1] : '';

    return {
      isValid: true,
      meetingNumber,
      password,
      originalLink: link,
    };
  } catch (error) {
    console.error('Error parsing Zoom link:', error);
    return { isValid: false, error: error.message };
  }
};

/**
 * Validate if a string is a valid Zoom meeting link
 * @param {string} link - Zoom meeting link to validate
 * @returns {boolean}
 */
export const isValidZoomLink = (link) => {
  const parsed = parseZoomLink(link);
  return parsed.isValid;
};

/**
 * Example usage:
 * 
 * const link = "https://zoom.us/j/93903519283?pwd=eutjyEQnFzdDaIzcD6PX2Y04MWpbpO.1";
 * const result = parseZoomLink(link);
 * 
 * if (result.isValid) {
 *   console.log('Meeting Number:', result.meetingNumber);
 *   console.log('Password:', result.password);
 * }
 */

