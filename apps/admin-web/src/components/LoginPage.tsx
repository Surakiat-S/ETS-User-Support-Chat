import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/auth-context';
import { fetchAdmins } from '../services/api';
import type { AdminListItem } from '../types/auth';
import { useEffect } from 'react';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [admins, setAdmins] = useState<AdminListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchAdmins()
      .then((items) => {
        if (!isMounted) {
          return;
        }

        setAdmins(items);
        if (items[0]) {
          setUsername(items[0].username);
        }
      })
      .catch((error) => {
        console.error('Load admins failed:', error);
        if (isMounted) {
          setErrorMessage('ไม่สามารถโหลดรายชื่อแอดมินได้');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingAdmins(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('กรุณาเลือกชื่อผู้ใช้');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        username: username.trim(),
      });
    } catch (error) {
      setErrorMessage('ไม่พบผู้ใช้ที่เลือก หรือผู้ใช้ไม่ได้อยู่ในสถานะใช้งาน');
      console.error('Mock admin login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            ET
          </div>
          <h1 className="text-2xl font-bold text-slate-900">เลือกผู้ใช้งานแอดมิน</h1>
          <p className="mt-2 text-sm text-slate-500">เข้าสู่ระบบแบบจำลองสำหรับเฟสปัจจุบัน</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Login As</span>
            <select
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={isLoadingAdmins || admins.length === 0}
            >
              {admins.length === 0 ? (
                <option value="">{isLoadingAdmins ? 'กำลังโหลดรายชื่อแอดมิน...' : 'ไม่พบรายชื่อแอดมิน'}</option>
              ) : (
                admins.map((admin) => (
                  <option key={admin.admin_id} value={admin.username}>
                    {admin.display_name} ({admin.username})
                  </option>
                ))
              )}
            </select>
          </label>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || isLoadingAdmins || admins.length === 0}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
