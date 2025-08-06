import React, { useState } from 'react'
import { useInvoices } from '../hooks/useInvoices'
import {
  Table,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Typography,
  Statistic,
  Spin,
  Alert,
  Empty,
  Tooltip,
  Badge
} from 'antd'
import {
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileOutlined,
  ReloadOutlined,
  CreditCardOutlined
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

const InvoiceList = () => {
  const { invoices, loading, error, generatePaymentComplement, downloadFile, clearError } = useInvoices()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [generatingComplement, setGeneratingComplement] = useState(null)

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.uuid.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'paid') return matchesSearch && invoice.payment_complement_generated
    if (filter === 'pending') return matchesSearch && !invoice.payment_complement_generated
    
    return matchesSearch
  })

  const handleGenerateComplement = async (invoiceId) => {
    setGeneratingComplement(invoiceId)
    try {
      await generatePaymentComplement(invoiceId)
    } finally {
      setGeneratingComplement(null)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'client_name',
      key: 'client_name',
      width: 200,
      ellipsis: true,
      render: (text) => (
        <Text strong style={{ color: '#1f2937' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Fecha',
      dataIndex: 'emission_date',
      key: 'emission_date',
      width: 120,
      render: (date) => (
        <Text type="secondary">
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      key: 'uuid',
      width: 280,
      ellipsis: true,
      render: (uuid) => (
        <Tooltip title={uuid}>
          <Text code style={{ fontSize: '11px' }}>
            {uuid}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      align: 'right',
      render: (amount) => (
        <Text strong>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 140,
      align: 'right',
      render: (amount) => (
        <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Estado',
      key: 'status',
      width: 180,
      align: 'center',
      render: (_, invoice) => {
        if (invoice.payment_complement_generated && invoice.facturama_id) {
          return (
            <Space direction="vertical" size={4}>
              <Tag icon={<CheckCircleOutlined />} color="success">
                Pagada
              </Tag>
              <Text code style={{ fontSize: '10px', color: '#059669' }}>
                {invoice.facturama_id}
              </Text>
            </Space>
          )
        }
        return (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Pendiente
          </Tag>
        )
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      render: (_, invoice) => {
        // Si no tiene complemento generado, mostrar botón para generar
        if (!invoice.payment_complement_generated) {
          return (
            <Button
              size="small"
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => handleGenerateComplement(invoice.id)}
              loading={generatingComplement === invoice.id}
            >
              Generar Complemento
            </Button>
          )
        }
        
        // Si tiene complemento generado, mostrar botones de descarga
        return (
          <Space>
            <Button
              size="small"
              danger
              icon={<FilePdfOutlined />}
              onClick={() => downloadFile(invoice.id, 'pdf')}
            >
              PDF
            </Button>
            <Button
              size="small"
              type="primary"
              ghost
              icon={<FileOutlined />}
              onClick={() => downloadFile(invoice.id, 'xml')}
            >
              XML
            </Button>
          </Space>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Title level={4}>Cargando facturas PPD...</Title>
          <Text type="secondary">Esto puede tomar unos segundos</Text>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error al cargar facturas"
          description={error}
          type="error"
          showIcon
          action={
            <Button
              size="small"
              danger
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          }
        />
      </div>
    )
  }

  const paidCount = invoices.filter(inv => inv.payment_complement_generated).length
  const pendingCount = invoices.filter(inv => !inv.payment_complement_generated).length
  const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)

  return (
    <div style={{ padding: '5px', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Facturas PPD
            </Title>
            <Text type="secondary">
              Gestiona tus facturas de pago en parcialidades o diferido
            </Text>
          </Col>
          <Col>
            <Statistic
              title="Total Facturas"
              value={invoices.length}
              valueStyle={{ color: '#1890ff', fontSize: '32px' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Facturas Pagadas"
              value={paidCount}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pendientes"
              value={pendingCount}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Ingresos"
              value={totalAmount}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Buscar por cliente o UUID..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              value={filter}
              onChange={setFilter}
            >
              <Option value="all">Todas las facturas</Option>
              <Option value="paid">Solo pagadas</Option>
              <Option value="pending">Solo pendientes</Option>
            </Select>
          </Col>
          <Col xs={24} md={10}>
            <div style={{ textAlign: 'right' }}>
              <Badge
                count={filteredInvoices.length}
                style={{ backgroundColor: '#52c41a' }}
              >
                <Text type="secondary">
                  Mostrando de {invoices.length} facturas
                </Text>
              </Badge>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        {filteredInvoices.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm || filter !== 'all'
                ? 'No se encontraron facturas con los filtros aplicados'
                : 'No hay facturas PPD disponibles'
            }
          >
            {(!searchTerm && filter === 'all') && (
              <Button type="primary" icon={<FileTextOutlined />}>
                Cargar archivos XML
              </Button>
            )}
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredInvoices}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} facturas`,
            }}
            scroll={{ x: 1200 }}
            size="middle"
          />
        )}
      </Card>
    </div>
  )
}

export default InvoiceList
