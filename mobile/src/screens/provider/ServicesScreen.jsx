import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Plus, Trash2, Briefcase, ChevronDown } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { colors, typography, spacing, radius, shadows } from '../../theme';
import providerService from '../../services/providerService';
import apiClient from '../../services/apiClient';

import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [form, setForm] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
    durationMinutes: '',
  });

  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD SERVICES
  // =========================

  const loadServices = async () => {
    try {
      setLoading(true);

      const data = await providerService.listMyServices();

      setServices(data || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not load services',
        text2: error?.message || 'Something went wrong',
      });
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

    console.log('CATEGORIES:', JSON.stringify(data, null, 2));

    setCategories(data || []);
  } catch (error) {
    console.log(
      'CATEGORY ERROR:',
      error?.response?.data || error.message
    );

    Toast.show({
      type: 'error',
      text1: 'Could not load categories',
      text2: error?.response?.data?.message || error.message,
    });
  } finally {
    setCategoriesLoading(false);
  }
};

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm({
      category: '',
      name: '',
      description: '',
      price: '',
      durationMinutes: '',
    });
  };

  // =========================
  // OPEN MODAL
  // =========================

  const openAddService = () => {
    resetForm();
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
  // GET SELECTED CATEGORY
  // =========================

  const selectedCategory = categories.find(
    (category) => category._id === form.category
  );

  // =========================
  // CREATE SERVICE
  // =========================

  const submit = async () => {
    if (!form.category) {
      Toast.show({
        type: 'error',
        text1: 'Select a category',
      });
      return;
    }

    if (!form.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter service name',
      });
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      Toast.show({
        type: 'error',
        text1: 'Enter a valid price',
      });
      return;
    }

    if (!form.durationMinutes || Number(form.durationMinutes) <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Enter a valid duration',
      });
      return;
    }

    setSaving(true);

    try {
      await providerService.createService({
        category: form.category,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      });

      setModalVisible(false);
      resetForm();

      await loadServices();

      Toast.show({
        type: 'success',
        text1: 'Service created',
        text2: 'Your service is now available to customers.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Could not add service',
        text2: error?.response?.data?.message || error?.message,
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE SERVICE
  // =========================

  const remove = (service) => {
    Alert.alert(
      'Delete service?',
      `Are you sure you want to delete "${service.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await providerService.deleteService(service._id);

              await loadServices();

              Toast.show({
                type: 'success',
                text1: 'Service deleted',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Could not delete service',
                text2:
                  error?.response?.data?.message || error?.message,
              });
            }
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
  // RENDER
  // =========================

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>My Services</Text>
          <Text style={styles.subtitle}>
            Manage the services customers can book
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddService}
          activeOpacity={0.8}
        >
          <Plus size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* SERVICE LIST */}

      {services.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={48} color={colors.textMuted} />}
          title="No services yet"
          subtitle="Add your first service so customers can book you."
          actionLabel="Add Service"
          onAction={openAddService}
        />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.serviceIcon}>
                <Briefcase size={20} color={colors.primary} />
              </View>

              <View style={styles.serviceInfo}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>

                {!!item.description && (
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}

                <View style={styles.metaRow}>
                  <Text style={styles.meta}>
                    {item.durationMinutes} min
                  </Text>

                  <Text style={styles.dot}>•</Text>

                  <Text style={styles.price}>
                    Rs {item.price}
                  </Text>
                </View>

                {item.category?.name && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {item.category.name}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => remove(item)}
                hitSlop={8}
                style={styles.deleteButton}
              >
                <Trash2 size={18} color={colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* ADD SERVICE MODAL */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalTitle}>Add Service</Text>

              <Text style={styles.modalSubtitle}>
                Create a service customers can book from your profile.
              </Text>

              {/* CATEGORY */}

              <Text style={styles.label}>Category</Text>

              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setCategoryModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categorySelectorText,
                    !selectedCategory && styles.placeholderText,
                  ]}
                >
                  {selectedCategory?.name || 'Select category'}
                </Text>

                <ChevronDown
                  size={20}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {/* NAME */}

              <Input
                label="Service Name"
                value={form.name}
                onChangeText={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
                placeholder="e.g. Premium Haircut"
              />

              {/* DESCRIPTION */}

              <Input
                label="Description"
                value={form.description}
                onChangeText={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
                placeholder="Describe your service"
                multiline
              />

              {/* PRICE */}

              <Input
                label="Price (Rs)"
                value={form.price}
                onChangeText={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    price: value,
                  }))
                }
                placeholder="e.g. 1500"
                keyboardType="numeric"
              />

              {/* DURATION */}

              <Input
                label="Duration (minutes)"
                value={form.durationMinutes}
                onChangeText={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    durationMinutes: value,
                  }))
                }
                placeholder="e.g. 45"
                keyboardType="numeric"
              />

              <Button
                title="Save Service"
                onPress={submit}
                loading={saving}
              />

              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={{ marginTop: spacing.xs }}
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
        onRequestClose={() => setCategoryModalVisible(false)}
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
              <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      form.category === item._id &&
                        styles.categoryItemSelected,
                    ]}
                    onPress={() => selectCategory(item)}
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
                )}
              />
            )}

            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setCategoryModalVisible(false)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },

  title: {
    ...typography.h2,
  },

  subtitle: {
    ...typography.caption,
    marginTop: 3,
  },

  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: spacing.sm,
  },

  listContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },

  serviceIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  serviceInfo: {
    flex: 1,
  },

  name: {
    ...typography.h4,
    fontSize: 15,
  },

  description: {
    ...typography.caption,
    marginTop: 3,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  meta: {
    ...typography.caption,
  },

  dot: {
    marginHorizontal: 6,
    color: colors.textMuted,
  },

  price: {
    ...typography.caption,
    fontWeight: '600',
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    marginTop: 7,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },

  categoryText: {
    ...typography.caption,
    fontSize: 11,
  },

  deleteButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
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
    maxHeight: '90%',
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