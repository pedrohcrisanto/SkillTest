class Exam < ApplicationRecord
  belongs_to :patient

  belongs_to :point_po, class_name: "Point", :foreign_key => 'point_po_id', dependent: :destroy
  belongs_to :point_or, class_name: "Point", :foreign_key => 'point_or_id', dependent: :destroy
  belongs_to :point_a, class_name: "Point", :foreign_key => 'point_n_id', dependent: :destroy
  belongs_to :point_n, class_name: "Point", :foreign_key => 'point_a_id', dependent: :destroy

  accepts_nested_attributes_for :point_po
  accepts_nested_attributes_for :point_or
  accepts_nested_attributes_for :point_n
  accepts_nested_attributes_for :point_a

  def maxillary_depth_angle
    tg_alfa2 = (self.point_po.y - self.point_or.y) / (self.point_or.x - self.point_po.x)
    tg_beta = (self.point_a.x - self.point_n.x) / ( self.point_a.y - self.point_n.y )

    ang_alfa2 = tg_alfa2 * (180.0/Math::PI)
    ang_beta = tg_beta * (180.0/Math::PI)

    ang_beta2 = 90 - ang_beta
   
    ang_alfa = ang_beta2 + ang_alfa2

    ang_omega = 180 - ang_alfa

    return ang_omega
    
     

  end
end
