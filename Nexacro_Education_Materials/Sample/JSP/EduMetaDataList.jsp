<?xml version="1.0" encoding="utf-8"?>
<Root xmlns="http://www.tobesoft.com/platform/dataset" ver="5000">
  <Parameters>
    <Parameter id="ErrorCode" type="int">0</Parameter>
    <Parameter id="ErrorMsg" type="string">success</Parameter>
  </Parameters>
  <Dataset id="test">
    <ColumnInfo>
      <Column id="DOMAIN" type="string" size="255"/>
      <Column id="MODEL" type="string" size="255"/>
      <Column id="DESCRIPTION" type="string" size="255"/>
      <Column id="DATASOURCE" type="string" size="255"/>      
    </ColumnInfo>
    <Rows>     
      <Row>
        <Col id="DOMAIN">metadata</Col>
        <Col id="MODEL">metadata</Col>
        <Col id="DESCRIPTION">description</Col>
        <Col id="DATASOURCE">DB</Col>
      </Row>      
    </Rows>
  </Dataset>
</Root>
