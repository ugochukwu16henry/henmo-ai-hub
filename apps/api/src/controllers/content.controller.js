const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class ContentController {
  // Get all content
  async getAllContent(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM website_content ORDER BY display_order ASC'
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get content by type
  async getContentByType(req, res) {
    try {
      const { type } = req.params;
      const result = await pool.query(
        'SELECT * FROM website_content WHERE type = $1 AND active = true ORDER BY display_order ASC',
        [type]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create content
  async createContent(req, res) {
    try {
      const { type, title, content, image_url, display_order, active } = req.body;
      const userId = req.user.id;

      const result = await pool.query(
        `INSERT INTO website_content 
         (type, title, content, image_url, display_order, active, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [type, title, content, image_url, display_order, active, userId]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update content
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const { type, title, content, image_url, display_order, active } = req.body;

      const result = await pool.query(
        `UPDATE website_content 
         SET type = $1, title = $2, content = $3, image_url = $4, 
             display_order = $5, active = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [type, title, content, image_url, display_order, active, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete content
  async deleteContent(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM website_content WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }

      res.json({ message: 'Content deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Blog post management
  async getAllBlogPosts(req, res) {
    try {
      const result = await pool.query(
        `SELECT bp.*, u.name as author_name 
         FROM blog_posts bp 
         LEFT JOIN users u ON bp.author_id = u.id 
         ORDER BY bp.created_at DESC`
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createBlogPost(req, res) {
    try {
      const { title, slug, excerpt, content, featured_image, status } = req.body;
      const authorId = req.user.id;

      const result = await pool.query(
        `INSERT INTO blog_posts 
         (title, slug, excerpt, content, featured_image, author_id, status, published_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, slug, excerpt, content, featured_image, authorId, status, 
         status === 'published' ? new Date() : null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // SEO metadata management
  async getSEOMetadata(req, res) {
    try {
      const { path } = req.params;
      const result = await pool.query(
        'SELECT * FROM seo_metadata WHERE page_path = $1',
        [path]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'SEO metadata not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateSEOMetadata(req, res) {
    try {
      const { path } = req.params;
      const { title, description, keywords, og_title, og_description, og_image } = req.body;

      const result = await pool.query(
        `INSERT INTO seo_metadata 
         (page_path, title, description, keywords, og_title, og_description, og_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (page_path) 
         DO UPDATE SET 
           title = $2, description = $3, keywords = $4,
           og_title = $5, og_description = $6, og_image = $7,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [path, title, description, keywords, og_title, og_description, og_image]
      );

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ContentController();