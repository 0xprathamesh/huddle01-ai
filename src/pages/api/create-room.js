export default async function handler(req, res) {
    try {
      const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
        method: "POST",
        body: JSON.stringify({
          title: req.body.title || "Huddle01 Room",
        }),
        headers: {
          "Content-type": "application/json",
          "x-api-key": "ak_BrbwMs3KCoDUjjXo",
        },
      });
  
      const data = await response.json();
      res.status(200).json({ roomId: data.data.roomId });
    } catch (error) {
      res.status(500).json({ error: "Failed to create room" });
    }
  }