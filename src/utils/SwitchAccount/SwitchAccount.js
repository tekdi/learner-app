import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from '../../context/LanguageContext';

const SwitchAccountDialog = ({
  visible,
  onClose,
  callbackFunction,
  authResponse,
  callBackError,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [allowedRoleIds, setAllowedRoleIds] = useState([
    'eea7ddab-bdf9-4db1-a1bb-43ef503d65ef',
  ]);

  useEffect(() => {
    if (authResponse && authResponse.length > 0) {
      let autoLogin = true; // Default to true for auto-login
      let isAllowed = false;
      authResponse?.forEach((tenant) => {
        tenant?.roles?.forEach((role) => {
          if (allowedRoleIds.includes(role?.roleId)) {
            isAllowed = true;
          }
        });
      });
      if (isAllowed === false) {
        callBackError();
      } else {
        // Check if there's only one tenant and one role
        const totalTenants = authResponse.length;
        const totalRoles = authResponse.reduce(
          (total, tenant) => total + tenant.roles.length,
          0
        );

        if (totalTenants === 1 && totalRoles === 1) {
          // Auto-select the single tenant and role
          const singleTenant = authResponse[0];
          const singleRole = singleTenant.roles[0];

          // Call the callback function with the auto-selected values
          callbackFunction(
            singleTenant.tenantId,
            singleTenant.tenantName,
            singleRole.roleId,
            singleRole.roleName
          );
        } else {
          if (visible) {
            handleOpenDialog();
            setActiveStep(0);
            setSelectedTenant(null);
            setSelectedRole(null);
          }
        }
      }
    }
  }, [visible]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    onClose();
  };

  const handleTenantSelect = (tenant) => {
    setSelectedTenant(tenant);
    setSelectedRole(null);

    // Filter roles to only include allowed ones
    const allowedRoles = tenant.roles.filter((role) =>
      allowedRoleIds.includes(role.roleId)
    );

    if (allowedRoles.length === 1) {
      // Auto-select the single allowed role and call callback
      const singleRole = allowedRoles[0];
      setSelectedRole(singleRole);
      callbackFunction(
        tenant.tenantId,
        tenant.tenantName,
        singleRole.roleId,
        singleRole.roleName
      );
      handleCloseDialog();
    } else {
      // Show role selection dialog
      setActiveStep(1);
    }
  };

  const handleRoleSelect = (role) => {
    if (allowedRoleIds.includes(role.roleId)) {
      setSelectedRole(role);
    } else {
      // Show error for non-allowed role
      Alert.alert(
        t('role_not_allowed_error'),
        `${t('role_not_allowed_error')} - ${role.roleName}`,
        [{ text: t('okay'), style: 'default' }]
      );
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
      setSelectedTenant(null);
      setSelectedRole(null);
    }
  };

  const handleConfirm = () => {
    if (selectedTenant && selectedRole) {
      // Call the callback function with the 4 required parameters
      callbackFunction(
        selectedTenant.tenantId,
        selectedTenant.tenantName,
        selectedRole.roleId,
        selectedRole.roleName
      );

      handleCloseDialog();
    }
  };

  const steps = [t('select_tenant'), t('select_role')];

  const Chip = ({ label, selected = false }) => (
    <View style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </View>
  );

  const StepIndicator = ({ steps, activeStep }) => (
    <View style={styles.stepperContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              index <= activeStep && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                index <= activeStep && styles.stepNumberActive,
              ]}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              index <= activeStep && styles.stepLabelActive,
            ]}
          >
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < activeStep && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const BusinessIcon = () => (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>🏢</Text>
    </View>
  );

  const PersonIcon = () => (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>👤</Text>
    </View>
  );

  const CheckIcon = () => (
    <View style={styles.checkIcon}>
      <Text style={styles.checkIconText}>✓</Text>
    </View>
  );

  const renderTenantSelection = () => (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.sectionHeader}>
        <BusinessIcon />
        <Text style={styles.sectionTitle}>{t('select_your_organization')}</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        {t('choose_organization_description')}
      </Text>

      <View style={styles.listContainer}>
        {authResponse?.map((tenant, index) => (
          <TouchableOpacity
            key={tenant.tenantId}
            style={[
              styles.tenantCard,
              selectedTenant?.tenantId === tenant.tenantId &&
                styles.selectedCard,
            ]}
            onPress={() => handleTenantSelect(tenant)}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <BusinessIcon />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.tenantName}>{tenant.tenantName}</Text>
                  {/* <Text style={styles.tenantType}>{tenant.tenantType}</Text> */}
                  <View style={styles.rolesContainer}>
                    {tenant.roles.map((role) => (
                      <Chip
                        key={role.roleId}
                        label={role.roleName}
                        selected={allowedRoleIds.includes(role.roleId)}
                        style={
                          !allowedRoleIds.includes(role.roleId)
                            ? styles.disabledChip
                            : null
                        }
                      />
                    ))}
                    {tenant.roles.filter((role) =>
                      allowedRoleIds.includes(role.roleId)
                    ).length === 0 && (
                      <View style={styles.noRoleContainer}>
                        <Text style={styles.cannotLoginText}>
                          {t('cannot_login_no_learner_role')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {selectedTenant?.tenantId === tenant.tenantId && <CheckIcon />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderRoleSelection = () => (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.roleHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{t('back_arrow')}</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>
          {t('select_role_for')?.replace(
            '{tenantName}',
            selectedTenant?.tenantName
          )}
        </Text>
      </View>

      <Text style={styles.sectionSubtitle}>{t('choose_role_description')}</Text>

      <View style={styles.listContainer}>
        {selectedTenant?.roles?.map((role) => {
          const isAllowed = allowedRoleIds.includes(role.roleId);
          return (
            <TouchableOpacity
              key={role.roleId}
              style={[
                styles.roleCard,
                selectedRole?.roleId === role.roleId && styles.selectedCard,
                !isAllowed && styles.disabledRoleCard,
              ]}
              onPress={() => handleRoleSelect(role)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.avatarSecondary,
                      !isAllowed && styles.disabledAvatar,
                    ]}
                  >
                    <PersonIcon />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text
                      style={[
                        styles.roleName,
                        !isAllowed && styles.disabledText,
                      ]}
                    >
                      {role.roleName}
                    </Text>
                    {/* <Text style={styles.roleId}>
                      {t('role_id')?.replace('{roleId}', role.roleId)}
                    </Text> */}
                    {!isAllowed && (
                      <Text style={styles.errorText}>
                        {t('role_not_allowed_error')}
                      </Text>
                    )}
                  </View>
                  {selectedRole?.roleId === role.roleId && <CheckIcon />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {selectedTenant?.roles?.filter((role) =>
          allowedRoleIds.includes(role.roleId)
        ).length === 0 && (
          <View style={styles.noRoleContainer}>
            {/* <Text style={styles.noRoleText}>{t('not_found_learner_role')}</Text> */}
            {/* <Text style={styles.roleIdText}>
              {t('role_id')?.replace(
                '{roleId}',
                selectedTenant?.roles?.map((role) => role.roleId).join(', ')
              )}
            </Text> */}
            <Text style={styles.cannotLoginText}>
              {t('cannot_login_no_learner_role')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={dialogOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseDialog}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <PersonIcon />
              <Text style={styles.headerText}>{t('select_account')}</Text>
            </View>
            <StepIndicator steps={steps} activeStep={activeStep} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content */}
          <View style={styles.content}>
            {activeStep === 0 && renderTenantSelection()}
            {activeStep === 1 && renderRoleSelection()}
          </View>

          {/* Actions */}
          <View style={styles.divider} />
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={handleCloseDialog}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>

            {/* {activeStep === 1 && (
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backActionButton}
              >
                <Text style={styles.backActionButtonText}>{t('back_arrow')}</Text>
              </TouchableOpacity>
            )} */}

            <TouchableOpacity
              onPress={handleConfirm}
              style={[
                styles.confirmButton,
                (!selectedTenant || !selectedRole) &&
                  styles.confirmButtonDisabled,
              ]}
              disabled={!selectedTenant || !selectedRole}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  (!selectedTenant || !selectedRole) &&
                    styles.confirmButtonTextDisabled,
                ]}
              >
                {t('confirm_selection')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    minHeight: 500,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#FDBE16',
  },
  stepNumber: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#FDBE16',
    fontWeight: 'bold',
  },
  stepLine: {
    position: 'absolute',
    top: 15,
    left: '100%',
    width: '100%',
    height: 2,
    backgroundColor: '#e0e0e0',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: '#FDBE16',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 0,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  roleHeader: {
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 0,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
  tenantCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tenantType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  roleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  roleId: {
    fontSize: 14,
    color: '#666',
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#FDBE16',
  },
  chipSelected: {
    backgroundColor: '#FDBE16',
  },
  chipText: {
    fontSize: 12,
    color: '#FDBE16',
  },
  chipTextSelected: {
    color: 'white',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    padding: 12,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  backActionButton: {
    padding: 12,
    paddingHorizontal: 20,
  },
  backActionButtonText: {
    color: '#666',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#FDBE16',
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
  noRoleContainer: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRoleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  roleIdText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  cannotLoginText: {
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 1,
    fontWeight: 'bold',
  },
  disabledChip: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  disabledRoleCard: {
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
  },
  disabledAvatar: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#999',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 1,
    fontWeight: 'bold',
  },
});

export default SwitchAccountDialog;
