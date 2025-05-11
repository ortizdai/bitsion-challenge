import { validateAttribute } from '../schemas/attribute.js'

export class AttributeController {
    constructor({ attributeModel }) {
        this.attributeModel = attributeModel
    }
    createAttribute = async (req, res) => {
        const result = validateAttribute(req.body);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }

        try {
            const newAttribute = await this.attributeModel.createAttribute({ input: result.data });
            res.status(201).json(newAttribute);
        } catch (error) {
            console.error('Error creating attribute:', error);
        }
    }
    deleteAttribute = async (req, res) => {
        const { id } = req.params
        const result = await this.attributeModel.deleteAttribute({ id })

        if (result === false) {
            return res.status(404).json({ message: 'Attribute not found' })
        }

        return res.json({ message: 'Attribute deleted' })
    }

    updateAttribute = async (req, res) => {
        const result = validateAttribute(req.body)

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const updatedAttribute = await this.attributeModel.updateAttribute({ id, input: result.data })

        return res.json(updatedAttribute)
    }
    getAllAttributes = async (req, res) => {
        const { attribute } = req.query
        const attributes = await this.attributeModel.getAllAttributes({ attribute })
        res.json(attributes)
    }
}