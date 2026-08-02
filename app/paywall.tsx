import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack, useRouter } from 'expo-router';

import { colors } from '../src/theme/colors';
import { useEntitlementStore } from '../src/store/useEntitlementStore';
import { iapService, PRODUCTS, type Product, type ProductId } from '../src/services/iap';
import { CheckIcon } from '../src/components/icons/CheckIcon';

export default function PaywallScreen() {
  const { t } = useTranslation('paywall');
  const router = useRouter();
  const isPremium = useEntitlementStore((state) => state.isPremium);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedId, setSelectedId] = useState<ProductId>('premium_yearly');
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    iapService.getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (isPremium) {
      router.back();
    }
  }, [isPremium, router]);

  const handlePurchase = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const result = await iapService.purchase(selectedId);
      if (result.success) {
        setStatusMessage(t('purchaseSuccess'));
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleRestore = async () => {
    setIsBusy(true);
    setStatusMessage(null);
    try {
      const result = await iapService.restorePurchases();
      setStatusMessage(result.success ? t('restoreSuccess') : t('restoreNone'));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t('title') }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.trialBadge}>
        <Text style={styles.trialBadgeText}>{t('trialBadge')}</Text>
      </View>
      <Text style={styles.title}>{t('title')}</Text>
      <Text style={styles.subtitle}>{t('subtitle')}</Text>

      <View style={styles.featureList}>
        {(['noAds', 'themes', 'faceIcons', 'unlimited'] as const).map((key) => (
          <View key={key} style={styles.featureRow}>
            <CheckIcon size={16} color={colors.accent} />
            <Text style={styles.featureText}>{t(`features.${key}`)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {products.map((product) => {
          const selected = product.id === selectedId;
          return (
            <Pressable
              key={product.id}
              accessibilityRole="button"
              style={[styles.planCard, selected && styles.planCardSelected]}
              onPress={() => setSelectedId(product.id)}
            >
              <Text style={[styles.planLabel, selected && styles.planLabelSelected]}>
                {product.periodLabel === 'year' ? t('yearly') : t('monthly')}
              </Text>
              <Text style={[styles.planPrice, selected && styles.planLabelSelected]}>
                {product.priceLabel}
                {product.periodLabel === 'year' ? t('perYear') : t('perMonth')}
              </Text>
              <Text style={styles.planTrialNote}>{t('trialNote')}</Text>
            </Pressable>
          );
        })}
      </View>

      {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}

      <Pressable accessibilityRole="button" style={styles.purchaseButton} onPress={handlePurchase} disabled={isBusy}>
        {isBusy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.purchaseText}>{t('startTrial')}</Text>}
      </Pressable>
      <Text style={styles.trialDisclaimer}>{t('trialDisclaimer')}</Text>

      <Pressable accessibilityRole="button" onPress={handleRestore} disabled={isBusy}>
        <Text style={styles.restoreText}>{t('restore')}</Text>
      </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  trialBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD6EC',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  trialBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  featureList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  plans: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    gap: 6,
  },
  planCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFF0F8',
  },
  planLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  planLabelSelected: {
    color: colors.accent,
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  planTrialNote: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CAF7D',
  },
  status: {
    fontSize: 13,
    color: '#4CAF7D',
    textAlign: 'center',
    fontWeight: '600',
  },
  purchaseButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  trialDisclaimer: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: -8,
  },
  restoreText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
