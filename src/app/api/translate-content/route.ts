import { TranslationRequest } from "@/types/TranslationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const requestContext = getOptionalRequestContext();
    if (!requestContext) {
      return;
    }

    const { source_lang, target_lang, text } =
      (await req.json()) as TranslationRequest;

    const response = await requestContext.env.AI.run("@cf/meta/m2m100-1.2b", {
      text,
      source_lang,
      target_lang,
    });

    if (!response.translated_text) {
      return Response.json(new ApiError(500, "Failed to translate content"), {
        status: 500,
      });
    }
    return Response.json(
      new ApiSuccess(
        200,
        "Successfully translated content",
        response.translated_text
      )
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error), {
      status: 500,
    });
  }
}
