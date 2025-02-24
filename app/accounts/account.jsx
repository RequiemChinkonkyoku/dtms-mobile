import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchAccounts } from '../../services/AccountService';

export default function Account() {
  const [accounts, setAccounts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAccounts = async () => { 
      try {
        const data = await fetchAccounts();
        if (Array.isArray(data)) {
          setAccounts(data);
        } else {
          console.error('Unexpected data format:', data);
          setAccounts([]);
        }
      } catch (error) {
        console.error('Failed to fetch accounts', error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Test api for Account</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : accounts.length > 0 ? (
        accounts.map((account) => (
          <Text key={account?.id || Math.random()}>{account?.username || 'No username'}</Text>
        ))
      ) : (
        <Text>No accounts found</Text>
      )}

    </View>
  );
}
