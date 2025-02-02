export default function generateRecipeByName() {
  return `
Create a list of "Appetizers, Main Course, Desserts, Beverages, Cocktails" names. Output ONLY a stringified JSON string array with:

Make sure
- each category has 1 item
- try to create common and popular dish/item names across cuisines 
- name (max 40 chars)
- make sure all information is accurate and easy to understand

Format response as a single line JSON string without markdown, and make sure string is JSON.parse valid. Example input/output:

Output: "[\\"Truffle Burrata\\", \\"Tuna Tartare\\", \\"Wagyu Ribeye\\", ...]"

Now create
`;
}
