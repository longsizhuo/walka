'use client';
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import GoogleMap from "@/app/components/GoogleMap";

export default function ChatPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';

    const [input, setInput] = useState('');
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);


    useEffect(() => {
        async function fetchInitialPlan() {
            const res = await fetch('/api/gemini/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query })
            });
            const data = await res.json();
            console.log(query)
            console.log('Plan:', data);
            setPlan(data);
            setSessionId(data.sessionId);
        }

        if (query) {
            fetchInitialPlan();
        }
    }, [query]);

    const handleSubmit = async (customInput?: string) => {
        const message = customInput ?? input;
        if (!message.trim()) return;

        setInput('');
        setLoading(true);
        setPlan(null);

        try {
            const res = await fetch('/api/gemini/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId }),
            });

            const data = await res.json();
            setPlan(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {/* 左侧：旅行计划展示区 */}
            <section className="w-1/2 p-6 border-r overflow-auto h-screen">
                <h2 className="text-xl font-semibold mb-4">📋 旅行计划生成区</h2>
                {plan ? (
                    <TravelPlan planData={plan} />
                ) : (
                    <p className="text-gray-600">
                        {loading
                            ? '正在生成旅行计划，请稍候...'
                            : '请输入旅行需求并点击发送。'}
                    </p>
                )}
            </section>

            {/* 右侧：未来地图区域 + 输入框 */}
            <section className="w-1/2 p-6 flex flex-col h-screen">
                {/* 🗺️ 路线图占位符区域 */}
                <div className="flex-1 border rounded bg-gray-50 flex items-center justify-center text-gray-400 text-lg italic">
                    {plan && <GoogleMap locations={plan.plan} />}
                </div>

                {/* 输入框 */}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="输入你的旅行需求..."
                        className="flex-grow p-2 border rounded"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        disabled={loading}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => handleSubmit()}
                        disabled={loading}
                    >
                        {loading ? '生成中...' : '发送'}
                    </button>
                </div>
            </section>
        </>
    );
}

// 旅行计划卡片展示组件
function TravelPlan({ planData }: { planData: any }) {
    if (!planData || !Array.isArray(planData.plan)) return null;

    const typeMap: Record<string, string> = {
        cultural: '文化',
        outdoor: '户外',
        food: '美食',
        shopping: '购物',
        historical: '历史',
        entertainment: '娱乐',
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">
                📅 行程日期：{planData.date || '未指定'}
            </h3>
            {planData.plan.map((item: any, index: number) => (
                <div
                    key={index}
                    className="bg-white p-4 border rounded shadow-sm"
                >
                    <div className="text-base font-semibold mb-1">
                        🕗 {item.time} ｜ {item.name}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                        📌 类型：{typeMap[item.type] || item.type}
                    </div>
                    <div className="text-sm text-gray-700">📖 简介：{item.info}</div>
                </div>
            ))}
        </div>
    );
}
