
export async function onRequestGet({ request, env }) {


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
