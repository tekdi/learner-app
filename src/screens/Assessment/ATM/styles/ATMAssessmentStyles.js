import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const ATMAssessmentStyles = StyleSheet.create({
  // Main container styles
  container: {
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 10,
    flex: 0.9,
  },

  // Image upload section styles
  imageUploadSection: {
    marginTop: 20,
  },

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    height: 52,
  },

  uploadButtonText: {
    color: '#63605A',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  imageCountText: {
    fontSize: 12,
    color: '#7C766F',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },

  // Dialog styles
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: width * 0.85,
    maxWidth: 400,
  },

  dialogTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#4D4639',
    textAlign: 'center',
    marginBottom: 20,
  },

  dialogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECE6F0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D0C5B4',
  },

  dialogButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4D4639',
    marginLeft: 10,
  },

  dialogCloseButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  dialogCloseButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#7C766F',
  },

  // Image list styles
  imageListContainer: {
    marginTop: 15,
  },

  imageListTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4D4639',
    marginBottom: 10,
  },

  imageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  imageItemThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },

  imageItemInfo: {
    flex: 1,
  },

  imageItemName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4D4639',
  },

  imageItemSize: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7C766F',
    marginTop: 2,
  },

  removeButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },

  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },

  // Preview dialog styles
  previewDialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewDialogContainer: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
  },

  previewImage: {
    flex: 1,
    borderRadius: 8,
  },

  previewCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Grid styles
  gridContainer: {
    marginTop: 20,
  },

  gridTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#4D4639',
    marginBottom: 15,
  },

  gridItem: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },

  gridImage: {
    width: '100%',
    height: '100%',
  },

  gridImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },

  gridImageName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },

  // Submit button styles
  submitButton: {
    backgroundColor: '#4D4639',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },

  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },

  // Loading and progress styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4D4639',
    borderRadius: 2,
  },

  // Warning styles
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginTop: 10,
  },

  warningText: {
    color: '#856404',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // Full screen image viewer styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },

  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  fullScreenBackButton: {
    marginRight: 15,
  },

  fullScreenTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    flex: 1,
  },

  fullScreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullScreenImage: {
    width: width,
    height: height * 0.8,
    resizeMode: 'contain',
  },
});

export default ATMAssessmentStyles;
