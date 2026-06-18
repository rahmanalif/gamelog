import ListDetailsClient from "./list-details-client";

export default async function ListDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ListDetailsClient slug={slug} />;
}
