import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';

import {
  UserRound,
  Briefcase,
  MapPin,
  Star,
  ShieldCheck,
  ChevronDown,
  Pencil,
  Plus,
} from 'lucide-react-native';

import Toast from 'react-native-toast-message';

import { colors, typography, spacing, radius, shadows } from '../../theme';

import providerService from '../../services/providerService';

import LoadingState from '../../components/ui/LoadingState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ProfessionalScreen() {
  const [professional, setProfessional] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [form, setForm] = useState({
    profession: '',
    category: '',
    bio: '',
    experienceYears: '',
    gender: '',
    startingPrice: '',
    city: '',
    address: '',
  });

  // =========================
  // LOAD PROFESSIONAL
  // =========================

  const loadProfessional = async () => {
    try {
      setLoading(true);

      const data = await providerService.getMyProfessional();

      setProfessional(data || null);
    } catch (error) {
      // 404 means provider has not created a professional yet.
      if (error?.response?.status === 404) {
        setProfessional(null);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Could not load profile',
          text2:
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD CATEGORIES
  // =========================

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);

      const data = await providerService.getCategories();

      setCategories(data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not load categories',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadProfessional();
    loadCategories();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      profession: '',
      category: '',
      bio: '',
      experienceYears: '',
      gender: '',
      startingPrice: '',
      city: '',
      address: '',
    });
  };

  // =========================
  // OPEN CREATE
  // =========================

  const openCreate = () => {
    resetForm();
    setModalVisible(true);
  };

  // =========================
  // OPEN EDIT
  // =========================

  const openEdit = () => {
    if (!professional) return;

    setForm({
      profession: professional.profession || '',
      category:
        professional.category?._id ||
        professional.category ||
        '',
      bio: professional.bio || '',
      experienceYears:
        professional.experienceYears !== undefined &&
        professional.experienceYears !== null
          ? String(professional.experienceYears)
          : '',
      gender: professional.gender || '',
      startingPrice:
        professional.startingPrice !== undefined &&
        professional.startingPrice !== null
          ? String(professional.startingPrice)
          : '',
      city: professional.location?.city || '',
      address: professional.location?.address || '',
    });

    setModalVisible(true);
  };

  // =========================
  // SELECT CATEGORY
  // =========================

  const selectCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      category: category._id,
    }));

    setCategoryModalVisible(false);
  };

  // =========================
  // SELECTED CATEGORY
  // =========================

  const selectedCategory = categories.find(
    (category) => category._id === form.category
  );

  // =========================
  // UPDATE FORM
  // =========================

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const submit = async () => {
    if (!form.profession.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter your profession',
      });
      return;
    }

    if (!form.category) {
      Toast.show({
        type: 'error',
        text1: 'Select a category',
      });
      return;
    }

    if (
      form.experienceYears === '' ||
      Number(form.experienceYears) < 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Enter valid experience',
      });
      return;
    }

    if (
      form.startingPrice === '' ||
      Number(form.startingPrice) < 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Enter a valid starting price',
      });
      return;
    }

    if (!form.city.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter your city',
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        profession: form.profession.trim(),
        category: form.category,
        bio: form.bio.trim(),
        experienceYears: Number(form.experienceYears),
        gender: form.gender,
        startingPrice: Number(form.startingPrice),

        location: {
          city: form.city.trim(),
          address: form.address.trim(),
        },
      };

      let result;

      if (professional) {
        result = await providerService.updateMyProfessional(payload);
      } else {
        result = await providerService.createProfessional(payload);
      }

      setProfessional(result);

      setModalVisible(false);
      resetForm();

      Toast.show({
        type: 'success',
        text1: professional
          ? 'Professional profile updated'
          : 'Professional profile created',
        text2: professional
          ? 'Your changes have been saved.'
          : 'You can now add services and availability.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: professional
          ? 'Could not update profile'
          : 'Could not create profile',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE / RESET
  // =========================

  const handleDelete = () => {
    Alert.alert(
      'Remove professional profile?',
      'This should only be available if your backend supports deleting a professional profile.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () => {
            Toast.show({
              type: 'info',
              text1: 'Delete endpoint not implemented',
              text2: 'Professional profiles should normally be deactivated instead.',
            });
          },
        },
      ]
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <LoadingState />;
  }

  // =========================
  // CREATE STATE
  // =========================

  if (!professional) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Professional</Text>

          <Text style={styles.subtitle}>
            Create your professional profile so customers can discover and book you.
          </Text>
        </View>

        <View style={styles.createCard}>
          <View style={styles.createIcon}>
            <UserRound
              size={34}
              color={colors.primary}
            />
          </View>

          <Text style={styles.createTitle}>
            Create your professional profile
          </Text>

          <Text style={styles.createDescription}>
            Tell customers what you do, your experience, pricing, and location.
          </Text>

          <Button
            title="Create Professional"
            onPress={openCreate}
          />
        </View>

        {renderFormModal()}
      </View>
    );
  }

  // =========================
  // PROFILE STATE
  // =========================

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Professional</Text>

          <Text style={styles.subtitle}>
            Manage the professional profile customers see.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={openEdit}
          activeOpacity={0.8}
        >
          <Pencil
            size={18}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <UserRound
                size={30}
                color={colors.primary}
              />
            </View>

            <View style={styles.profileIdentity}>
              <Text
                style={styles.profession}
                numberOfLines={1}
              >
                {professional.profession}
              </Text>

              <Text style={styles.category}>
                {professional.category?.name ||
                  'Professional'}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                {professional.isActive
                  ? 'Active'
                  : 'Inactive'}
              </Text>
            </View>

            {professional.isVerified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck
                  size={14}
                  color={colors.primary}
                />

                <Text style={styles.verifiedText}>
                  Verified
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Briefcase
              size={18}
              color={colors.primary}
            />

            <Text style={styles.statValue}>
              {professional.experienceYears || 0}
            </Text>

            <Text style={styles.statLabel}>
              Years experience
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Star
              size={18}
              color={colors.primary}
            />

            <Text style={styles.statValue}>
              {professional.rating || '0.0'}
            </Text>

            <Text style={styles.statLabel}>
              Rating
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.rupee}>Rs</Text>

            <Text style={styles.statValue}>
              {professional.startingPrice || 0}
            </Text>

            <Text style={styles.statLabel}>
              Starting price
            </Text>
          </View>
        </View>

        {!!professional.bio && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              About
            </Text>

            <Text style={styles.bio}>
              {professional.bio}
            </Text>
          </View>
        )}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            Professional Information
          </Text>

          <InfoRow
            icon={
              <Briefcase
                size={18}
                color={colors.primary}
              />
            }
            label="Profession"
            value={professional.profession}
          />

          <InfoRow
            icon={
              <UserRound
                size={18}
                color={colors.primary}
              />
            }
            label="Gender"
            value={
              professional.gender
                ? professional.gender.charAt(0).toUpperCase() +
                  professional.gender.slice(1)
                : 'Not specified'
            }
          />

          <InfoRow
            icon={
              <MapPin
                size={18}
                color={colors.primary}
              />
            }
            label="Location"
            value={
              [
                professional.location?.city,
                professional.location?.address,
              ]
                .filter(Boolean)
                .join(', ') || 'Not specified'
            }
          />
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>
            Next steps
          </Text>

          <Text style={styles.tipText}>
            Your professional profile is ready. Add your services and configure your availability so customers can book appointments with you.
          </Text>
        </View>

        {renderFormModal()}
      </ScrollView>
    </View>
  );

  // =========================
  // FORM MODAL
  // =========================

  function renderFormModal() {
    return (
      <>
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => {
            if (!saving) {
              setModalVisible(false);
            }
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>
                  {professional
                    ? 'Edit Professional'
                    : 'Create Professional'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  This information will be used to build your professional profile.
                </Text>

                {/* PROFESSION */}

                <Input
                  label="Profession"
                  value={form.profession}
                  onChangeText={(value) =>
                    updateForm('profession', value)
                  }
                  placeholder="e.g. Doctor"
                />

                {/* CATEGORY */}

                <Text style={styles.label}>
                  Category
                </Text>

                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() =>
                    setCategoryModalVisible(true)
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categorySelectorText,
                      !selectedCategory &&
                        styles.placeholderText,
                    ]}
                  >
                    {selectedCategory?.name ||
                      'Select category'}
                  </Text>

                  <ChevronDown
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>

                {/* BIO */}

                <Input
                  label="Bio"
                  value={form.bio}
                  onChangeText={(value) =>
                    updateForm('bio', value)
                  }
                  placeholder="Tell customers about your professional experience"
                  multiline
                />

                {/* EXPERIENCE */}

                <Input
                  label="Experience (years)"
                  value={form.experienceYears}
                  onChangeText={(value) =>
                    updateForm(
                      'experienceYears',
                      value.replace(/[^0-9]/g, '')
                    )
                  }
                  placeholder="e.g. 5"
                  keyboardType="numeric"
                />

                {/* GENDER */}

                <Text style={styles.label}>
                  Gender
                </Text>

                <View style={styles.genderRow}>
                  {['male', 'female', 'other'].map(
                    (gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderButton,
                          form.gender === gender &&
                            styles.genderButtonSelected,
                        ]}
                        onPress={() =>
                          updateForm('gender', gender)
                        }
                      >
                        <Text
                          style={[
                            styles.genderText,
                            form.gender === gender &&
                              styles.genderTextSelected,
                          ]}
                        >
                          {gender.charAt(0).toUpperCase() +
                            gender.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                {/* PRICE */}

                <Input
                  label="Starting Price (Rs)"
                  value={form.startingPrice}
                  onChangeText={(value) =>
                    updateForm(
                      'startingPrice',
                      value.replace(/[^0-9]/g, '')
                    )
                  }
                  placeholder="e.g. 1500"
                  keyboardType="numeric"
                />

                {/* CITY */}

                <Input
                  label="City"
                  value={form.city}
                  onChangeText={(value) =>
                    updateForm('city', value)
                  }
                  placeholder="e.g. Multan"
                />

                {/* ADDRESS */}

                <Input
                  label="Address"
                  value={form.address}
                  onChangeText={(value) =>
                    updateForm('address', value)
                  }
                  placeholder="e.g. Bosan Road"
                />

                <Button
                  title={
                    professional
                      ? 'Save Changes'
                      : 'Create Professional'
                  }
                  onPress={submit}
                  loading={saving}
                />

                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={() => {
                    if (saving) return;

                    setModalVisible(false);
                    resetForm();
                  }}
                  style={{
                    marginTop: spacing.xs,
                  }}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* CATEGORY MODAL */}

        <Modal
          visible={categoryModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() =>
            setCategoryModalVisible(false)
          }
        >
          <View style={styles.categoryModalOverlay}>
            <View style={styles.categoryModalCard}>
              <Text style={styles.categoryModalTitle}>
                Select Category
              </Text>

              {categoriesLoading ? (
                <LoadingState />
              ) : categories.length === 0 ? (
                <View style={styles.noCategories}>
                  <Text style={styles.noCategoriesText}>
                    No categories available.
                  </Text>
                </View>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                >
                  {categories.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      style={[
                        styles.categoryItem,
                        form.category === item._id &&
                          styles.categoryItemSelected,
                      ]}
                      onPress={() =>
                        selectCategory(item)
                      }
                    >
                      <Text
                        style={[
                          styles.categoryItemText,
                          form.category === item._id &&
                            styles.categoryItemTextSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <Button
                title="Cancel"
                variant="ghost"
                onPress={() =>
                  setCategoryModalVisible(false)
                }
                style={{
                  marginTop: spacing.sm,
                }}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

// =========================
// INFO ROW
// =========================

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        {icon}
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },

  header: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  headerText: {
    flex: 1,
    paddingRight: spacing.md,
  },

  title: {
    ...typography.h2,
  },

  subtitle: {
    ...typography.caption,
    marginTop: 3,
  },

  editButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.sm,
  },

  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  createCard: {
    margin: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },

  createIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  createTitle: {
    ...typography.h3,
    textAlign: 'center',
  },

  createDescription: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },

  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  profileIdentity: {
    flex: 1,
  },

  profession: {
    ...typography.h3,
  },

  category: {
    ...typography.caption,
    marginTop: 3,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    marginRight: 6,
  },

  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },

  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },

  verifiedText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    ...shadows.sm,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statDivider: {
    width: 1,
    height: 42,
    backgroundColor: colors.border,
  },

  statValue: {
    ...typography.h4,
    marginTop: 4,
  },

  statLabel: {
    ...typography.caption,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },

  rupee: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: 2,
  },

  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadows.sm,
  },

  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },

  bio: {
    ...typography.body,
    lineHeight: 21,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    ...typography.caption,
  },

  infoValue: {
    ...typography.body,
    marginTop: 2,
  },

  tipCard: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },

  tipTitle: {
    ...typography.h4,
    marginBottom: spacing.xs,
  },

  tipText: {
    ...typography.caption,
    lineHeight: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '92%',
  },

  modalTitle: {
    ...typography.h3,
    marginBottom: 4,
  },

  modalSubtitle: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },

  label: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },

  categorySelector: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },

  categorySelectorText: {
    ...typography.body,
  },

  placeholderText: {
    color: colors.textMuted,
  },

  genderRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },

  genderButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },

  genderButtonSelected: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },

  genderText: {
    ...typography.caption,
  },

  genderTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },

  categoryModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },

  categoryModalCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    maxHeight: '75%',
  },

  categoryModalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },

  categoryItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
  },

  categoryItemSelected: {
    backgroundColor: colors.background,
  },

  categoryItemText: {
    ...typography.body,
  },

  categoryItemTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },

  noCategories: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  noCategoriesText: {
    ...typography.caption,
  },
});