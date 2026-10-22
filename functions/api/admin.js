
export async function onRequestGet({ request, env }) {
  if (!env.DB || !env.ADMIN_PASSWORD) {
    return Response.json(
      { error: "管理画面の設定が不足しています" },
      { status: 500 }
    );
  }


  try {
    const result = await env.DB.prepare(
      "SELECT * FROM wedding_rsvps ORDER BY created_at DESC"
    ).all();

    return Response.json({
      ok: true,
      rows: result.results || []
    });
  } catch (error) {
    return Response.json(
      { error: "回答一覧を取得できません" },
      { status: 500 }
    );
  }
}
